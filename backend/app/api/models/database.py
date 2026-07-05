import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_verified = Column(Boolean, default=False)
    subscription_tier = Column(String(50), default="free") # free / pro / enterprise
    
    # Relationships
    analyses = relationship("AnalysisResult", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("AnalysisFeedback", back_populates="user", cascade="all, delete-orphan")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    input_text = Column(Text, nullable=False)
    input_url = Column(String(1024), nullable=True)
    authenticity_score = Column(Integer, nullable=False)
    gnn_score = Column(Integer, nullable=False)
    nlp_score = Column(Integer, nullable=False)
    source_reputation_score = Column(Integer, nullable=False)
    verdict = Column(String(100), nullable=False)
    risk_assessment = Column(JSON, nullable=False) # e.g. {"clickbait_risk": "Low", ...}
    findings = Column(JSON, nullable=False) # JSON array of findings
    model_versions = Column(JSON, nullable=False) # e.g. {"gnn": "v1.2.0", ...}
    analysis_time_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    feedbacks = relationship("AnalysisFeedback", back_populates="analysis", cascade="all, delete-orphan")

class AnalysisFeedback(Base):
    __tablename__ = "analysis_feedback"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analysis_results.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_accurate = Column(Boolean, nullable=False)
    confidence_level = Column(Integer, nullable=False) # 1 to 5
    feedback_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("AnalysisResult", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")
