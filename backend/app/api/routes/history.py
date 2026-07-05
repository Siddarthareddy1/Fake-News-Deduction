from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.dependencies import get_db, get_current_user
from app.api.models.database import User, AnalysisResult
from app.api.models.schemas import AnalyzeResponse

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("", response_model=List[AnalyzeResponse])
def get_user_history(
    limit: int = 10,
    offset: int = 0,
    verdict: Optional[str] = None,
    source: Optional[str] = None,
    sort_by: str = "date",
    sort_dir: str = "desc",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the authenticated user's past analysis results.
    Supports filtering by verdict and source domain, and custom sorting.
    """
    query = db.query(AnalysisResult).filter(AnalysisResult.user_id == current_user.id)
    
    # Apply filters
    if verdict:
        query = query.filter(AnalysisResult.verdict.ilike(f"%{verdict}%"))
    if source:
        query = query.filter(AnalysisResult.input_url.ilike(f"%{source}%"))
        
    # Apply sorting
    if sort_by == "score":
        order_col = AnalysisResult.authenticity_score
    else:
        order_col = AnalysisResult.created_at
        
    if sort_dir == "asc":
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())
        
    results = query.limit(limit).offset(offset).all()
    
    # Map database SQLAlchemy objects to response dictionary schema
    response_list = []
    for r in results:
        # Pydantic will serialize dates to ISO
        response_list.append({
            "id": r.id,
            "text_preview": r.input_text[:100] + "..." if len(r.input_text) > 100 else r.input_text,
            "authenticity_score": r.authenticity_score,
            "gnn_score": r.gnn_score,
            "nlp_score": r.nlp_score,
            "source_reputation": r.source_reputation_score,
            "verdict": r.verdict,
            "risk_assessment": r.risk_assessment,
            "findings": r.findings,
            # Reconstruct source list from URL metadata
            "sources": [{
                "name": r.input_url.split("//")[-1].split("/")[0] if r.input_url else "Unknown Source",
                "credibility_score": r.source_reputation_score,
                "shared_count": 100
            }],
            "analysis_time_ms": r.analysis_time_ms,
            "model_versions": r.model_versions,
            "timestamp": r.created_at
        })
        
    return response_list

@router.get("/{analysis_id}", response_model=AnalyzeResponse)
def get_analysis_by_id(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves details for a specific analysis result, confirming ownership.
    """
    result = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis result not found or access denied."
        )
        
    return {
        "id": result.id,
        "text_preview": result.input_text[:100] + "..." if len(result.input_text) > 100 else result.input_text,
        "authenticity_score": result.authenticity_score,
        "gnn_score": result.gnn_score,
        "nlp_score": result.nlp_score,
        "source_reputation": result.source_reputation_score,
        "verdict": result.verdict,
        "risk_assessment": result.risk_assessment,
        "findings": result.findings,
        "sources": [{
            "name": result.input_url.split("//")[-1].split("/")[0] if result.input_url else "Unknown Source",
            "credibility_score": result.source_reputation_score,
            "shared_count": 100
        }],
        "analysis_time_ms": result.analysis_time_ms,
        "model_versions": result.model_versions,
        "timestamp": result.created_at
    }
