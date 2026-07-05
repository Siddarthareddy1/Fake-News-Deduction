from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict
from datetime import datetime
from app.utils.validators import validate_text_length, validate_url

# User Auth Schemas
class UserSignUp(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters.")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    is_verified: bool
    subscription_tier: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# Analysis Schemas
class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Plain text content to analyze (min 50, max 50000 chars)")
    url: Optional[str] = Field(None, description="URL source domain of the article")
    title: Optional[str] = Field(None, description="Title of the article")
    
    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        ok, err = validate_text_length(v)
        if not ok:
            raise ValueError(err)
        return v

    @field_validator("url")
    @classmethod
    def validate_url_field(cls, v: Optional[str]) -> Optional[str]:
        if v and not validate_url(v):
            raise ValueError("Invalid URL format.")
        return v

class RiskAssessment(BaseModel):
    clickbait_risk: str
    bias_risk: str
    misinformation_risk: str

class Finding(BaseModel):
    type: str # "positive" | "warning" | "negative"
    title: str
    description: str

class Source(BaseModel):
    name: str
    credibility_score: int
    shared_count: int

class ModelVersions(BaseModel):
    gnn: str
    nlp: str
    source_db: str

class AnalyzeResponse(BaseModel):
    id: str
    text_preview: str
    authenticity_score: int
    gnn_score: int
    nlp_score: int
    source_reputation: int
    verdict: str
    risk_assessment: RiskAssessment
    findings: List[Finding]
    sources: List[Source]
    analysis_time_ms: int
    model_versions: ModelVersions
    timestamp: datetime

# Feedback Schemas
class FeedbackRequest(BaseModel):
    analysis_id: str
    is_accurate: bool
    confidence_level: int = Field(..., ge=1, le=5, description="Confidence rating from 1 to 5")
    feedback_text: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    analysis_id: str
    is_accurate: bool
    confidence_level: int
    feedback_text: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
