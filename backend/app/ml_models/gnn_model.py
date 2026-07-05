import os
from typing import Dict, Any, Tuple
from app.config import settings
from app.utils.logger import logger
from app.ml_models.source_credibility import get_source_credibility

_gnn_model = None
_has_loaded = False

def init_gnn_model():
    global _gnn_model, _has_loaded
    if _has_loaded:
        return
        
    try:
        import torch
        # Dynamically import the GNN class from root directory
        import sys
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
        from gnn_model.NEGT import Net
        
        logger.info(f"Loading NEGT GNN model weights from {settings.GNN_MODEL_PATH}...")
        # Instantiate GNN network
        if os.path.exists(settings.GNN_MODEL_PATH):
            _gnn_model = Net()
            _gnn_model.load_state_dict(torch.load(settings.GNN_MODEL_PATH, map_location=torch.device('cpu')))
            _gnn_model.eval()
            logger.info("NEGT GNN model loaded successfully.")
        else:
            logger.warning(f"GNN model weights not found at {settings.GNN_MODEL_PATH}. Running GNN in fallback mode.")
        _has_loaded = True
    except ImportError:
        logger.warning("torch/torch_geometric not installed in environment. GNN service running in fallback heuristic mode.")
        _has_loaded = True
    except Exception as e:
        logger.error(f"Failed to initialize GNN model: {e}. Running in fallback heuristic mode.")
        _has_loaded = True

def predict_gnn_authenticity(text: str, url: str) -> Tuple[int, Dict[str, Any]]:
    """
    Simulates or predicts cascade propagation features using GNN or fallback heuristics.
    Returns: (gnn_score (0-100), propagation_stats)
    """
    init_gnn_model()
    
    # 1. GNN evaluation (requires GNN weights and input graph data structure)
    # Note: Real GNN inference requires raw propagation graph from Twitter/Reddit API.
    # In this FastAPI app, we simulate or run heuristic inference if raw graphs aren't passed.
    
    # 2. Heuristics fallback: Analyze propagation topology based on text & URL domain
    source_score, domain_name = get_source_credibility(url)
    
    # If the source is low credibility, cascade is modeled as "Bot-Heavy/Viral Clickbait"
    # If the source is high credibility, cascade is modeled as "Organic/Verified Press"
    is_fake_profile = source_score < 40
    is_uncertain = 40 <= source_score <= 70
    
    if is_fake_profile:
        # Fictional viral bot-heavy cascade simulation
        gnn_score = int(source_score * 0.9 + 10)
        stats = {
            "max_hops": 4,
            "avg_breadth": 11.2,
            "virality_score": 8.4,
            "gib_filtering_score": 89,
            "bot_activity_rating": 42,
            "suspicious_patterns": 7,
            "anomalous_links": 3,
            "verified_press_pct": 14,
            "social_networks_pct": 62,
            "blogs_pct": 24,
            "sentiment_verdict": "Sensationalist & biased outrage pattern"
        }
    elif is_uncertain:
        # Mixed cascade propagation simulation
        gnn_score = int(source_score * 1.0)
        stats = {
            "max_hops": 5,
            "avg_breadth": 6.8,
            "virality_score": 5.1,
            "gib_filtering_score": 93,
            "bot_activity_rating": 18,
            "suspicious_patterns": 3,
            "anomalous_links": 1,
            "verified_press_pct": 35,
            "social_networks_pct": 45,
            "blogs_pct": 20,
            "sentiment_verdict": "Neutral to sensational citation pattern"
        }
    else:
        # High credibility organic cascade propagation simulation
        gnn_score = int(source_score * 0.85 + 15)
        stats = {
            "max_hops": 5,
            "avg_breadth": 3.6,
            "virality_score": 2.1,
            "gib_filtering_score": 98,
            "bot_activity_rating": 4,
            "suspicious_patterns": 1,
            "anomalous_links": 0,
            "verified_press_pct": 64,
            "social_networks_pct": 25,
            "blogs_pct": 11,
            "sentiment_verdict": "Informative & authentic citation pattern"
        }
        
    return min(100, max(0, gnn_score)), stats
