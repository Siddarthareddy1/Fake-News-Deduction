from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.api.models.database import User, AnalysisResult, AnalysisFeedback
from app.api.models.schemas import FeedbackRequest, FeedbackResponse

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_analysis_feedback(
    feedback: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits user feedback for a specific analysis (e.g. marking as accurate/inaccurate).
    """
    # Verify that the analysis result exists
    analysis = db.query(AnalysisResult).filter(AnalysisResult.id == feedback.analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis result not found."
        )
        
    # Check if user already submitted feedback for this analysis
    existing_feedback = db.query(AnalysisFeedback).filter(
        AnalysisFeedback.analysis_id == feedback.analysis_id,
        AnalysisFeedback.user_id == current_user.id
    ).first()
    
    if existing_feedback:
        # Update existing feedback
        existing_feedback.is_accurate = feedback.is_accurate
        existing_feedback.confidence_level = feedback.confidence_level
        existing_feedback.feedback_text = feedback.feedback_text
        db.commit()
        db.refresh(existing_feedback)
        return existing_feedback
        
    db_feedback = AnalysisFeedback(
        analysis_id=feedback.analysis_id,
        user_id=current_user.id,
        is_accurate=feedback.is_accurate,
        confidence_level=feedback.confidence_level,
        feedback_text=feedback.feedback_text
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback
