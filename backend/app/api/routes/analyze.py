from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_optional_current_user, rate_limiter
from app.api.models.database import User
from app.api.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services import analysis_service
from typing import Optional

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post(
    "/analyze", 
    response_model=AnalyzeResponse, 
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(rate_limiter)]
)
def analyze_article(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Main prediction endpoint. Preprocesses the text, evaluates model components,
    and returns a combined authenticity rating. Saves result to user history if logged in.
    """
    user_id = current_user.id if current_user else None
    result = analysis_service.run_news_analysis(db, request, user_id)
    return result
