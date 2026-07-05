from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from app.api.dependencies import get_db
from app.ml_models import gnn_model, nlp_model

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
def health_check(db: Session = Depends(get_db)):
    """
    Performs server diagnostic checks on database connectivity and model status.
    """
    db_status = "connected"
    try:
        # Run a simple light-weight query
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"
        
    # Check GNN model status
    gnn_status = "fallback"
    if gnn_model._gnn_model is not None:
        gnn_status = "loaded"
        
    # Check NLP model status
    nlp_status = "fallback"
    if nlp_model._pipeline is not None:
        nlp_status = "loaded"
        
    return {
        "status": "ok" if db_status == "connected" else "unhealthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database": db_status,
        "models": {
            "gnn": gnn_status,
            "nlp": nlp_status
        }
    }
