import time
import hashlib
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.api.models.database import AnalysisResult
from app.api.models.schemas import AnalyzeRequest
from app.ml_models import source_credibility, nlp_model, gnn_model, ensemble
from app.utils.logger import logger
from app.api.dependencies import redis_client

# Local in-memory cache fallback (for 24 hours cache)
# Schema: {md5_hash: (timestamp, cached_result_dict)}
in_memory_cache: Dict[str, tuple] = {}

def get_text_hash(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()

def check_cache(text_hash: str) -> Optional[Dict[str, Any]]:
    """
    Checks cache for previous analysis (Redis or memory).
    """
    # 1. Check Redis if available
    if redis_client:
        try:
            cached = redis_client.get(f"analysis:cache:{text_hash}")
            if cached:
                logger.info(f"Cache hit in Redis for text hash {text_hash}")
                return json.loads(cached)
        except Exception as e:
            logger.error(f"Redis cache fetch error: {e}")
            
    # 2. Check in-memory fallback
    if text_hash in in_memory_cache:
        timestamp, cached_data = in_memory_cache[text_hash]
        # Check if expired (24 hours = 86400 seconds)
        if time.time() - timestamp < 86400:
            logger.info(f"Cache hit in local memory for text hash {text_hash}")
            return cached_data
        else:
            # Clean expired entry
            del in_memory_cache[text_hash]
            
    return None

def write_cache(text_hash: str, result: Dict[str, Any]):
    """
    Writes result to cache.
    """
    # 1. Write to Redis if available
    if redis_client:
        try:
            redis_client.setex(
                f"analysis:cache:{text_hash}",
                86400, # 24 hours expiry
                json.dumps(result)
            )
            return
        except Exception as e:
            logger.error(f"Redis cache write error: {e}")
            
    # 2. Local in-memory fallback
    in_memory_cache[text_hash] = (time.time(), result)

def run_news_analysis(db: Session, request: AnalyzeRequest, user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Orchestrates the GNN, BERT, and Source credibility modules.
    Saves and caches results.
    """
    start_time = time.time()
    
    # Clean text input
    input_text = request.text.strip()
    text_hash = get_text_hash(input_text)
    
    # 1. Check cache to avoid re-analyzing
    cached_result = check_cache(text_hash)
    if cached_result:
        # If cache hit, but user is authenticated, save a copy in DB linked to user
        if user_id:
            save_analysis_to_db(db, cached_result, request, user_id)
        # Ensure timestamp is current for the response
        cached_result["timestamp"] = datetime.utcnow().isoformat() + "Z"
        return cached_result
        
    # 2. Run NLP prediction
    nlp_score = nlp_model.predict_nlp_authenticity(input_text)
    
    # 3. Run GNN prediction
    gnn_score, propagation_stats = gnn_model.predict_gnn_authenticity(input_text, request.url or "")
    
    # 4. Run Source Credibility evaluation
    source_score, source_name = source_credibility.get_source_credibility(request.url or "")
    
    # 5. Compile Ensemble Score
    final_score = ensemble.calculate_ensemble_score(gnn_score, nlp_score, source_score)
    verdict = ensemble.get_verdict(final_score)
    
    # 6. Formulate risk assessments and findings list
    risks = ensemble.assess_risks(gnn_score, nlp_score, source_score)
    findings = ensemble.compile_findings(gnn_score, nlp_score, source_score)
    
    # Prepare sources list
    sources_list = []
    if request.url:
        sources_list.append({
            "name": source_name,
            "credibility_score": source_score,
            "shared_count": propagation_stats.get("social_networks_pct", 0) * 45 # Simulated sharing metrics
        })
    else:
        sources_list.append({
            "name": "General Social Spread",
            "credibility_score": 50,
            "shared_count": 120
        })
        
    end_time = time.time()
    analysis_time_ms = int((end_time - start_time) * 1000)
    
    # Structure output
    analysis_data = {
        "text_preview": input_text[:100] + "..." if len(input_text) > 100 else input_text,
        "authenticity_score": final_score,
        "gnn_score": gnn_score,
        "nlp_score": nlp_score,
        "source_reputation": source_score,
        "verdict": verdict,
        "risk_assessment": risks,
        "findings": findings,
        "sources": sources_list,
        "analysis_time_ms": max(20, analysis_time_ms),
        "model_versions": {
            "gnn": "v1.2.0",
            "nlp": "bert-base-cased",
            "source_db": "2024-01-15"
        },
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    # 7. Write to cache
    write_cache(text_hash, analysis_data)
    
    # 8. Save to DB if authenticated user
    if user_id:
        db_id = save_analysis_to_db(db, analysis_data, request, user_id)
        analysis_data["id"] = db_id
    else:
        # Generate random temp UUID for guest
        import uuid
        analysis_data["id"] = str(uuid.uuid4())
        
    return analysis_data

def save_analysis_to_db(db: Session, analysis: Dict[str, Any], request: AnalyzeRequest, user_id: str) -> str:
    """
    Saves analysis metadata into database.
    """
    db_result = AnalysisResult(
        user_id=user_id,
        input_text=request.text,
        input_url=request.url,
        authenticity_score=analysis["authenticity_score"],
        gnn_score=analysis["gnn_score"],
        nlp_score=analysis["nlp_score"],
        source_reputation_score=analysis["source_reputation"],
        verdict=analysis["verdict"],
        risk_assessment=analysis["risk_assessment"],
        findings=analysis["findings"],
        model_versions=analysis["model_versions"],
        analysis_time_ms=analysis["analysis_time_ms"]
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result.id
