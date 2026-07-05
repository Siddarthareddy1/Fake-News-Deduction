import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENV: str = "development"
    
    # Database
    DATABASE_URL: str = "sqlite:///./fake_news.db"
    
    # Auth JWT
    JWT_SECRET_KEY: str = "supersecretjwtkeyforfakenewsverificationgnnproject2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    # ML Models
    GNN_MODEL_PATH: str = "app/ml_models/weights/gnn_weights.pt"
    NLP_MODEL_PATH: str = "app/ml_models/weights/bert_classifier"
    
    # Rate Limiting requests/day
    FREE_TIER_LIMIT: int = 10
    PRO_TIER_LIMIT: int = 1000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
