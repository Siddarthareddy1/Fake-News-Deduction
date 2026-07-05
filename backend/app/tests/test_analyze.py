import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.dependencies import get_db
from app.api.models.database import Base, AnalysisResult

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_analyze.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def run_around_tests():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_analyze_success():
    payload = {
        "text": "This is a legitimate news article that has a length of more than fifty characters to pass the validation constraints easily.",
        "url": "https://apnews.com/article/legit-story-2026",
        "title": "A Legit News Story"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "authenticity_score" in data
    assert "verdict" in data
    assert "risk_assessment" in data
    assert "findings" in data
    assert len(data["findings"]) > 0
    assert data["verdict"] == "Likely Authentic" # AP news has high credibility

def test_analyze_text_too_short():
    payload = {
        "text": "Too short text.",
        "url": "https://apnews.com"
    }
    response = client.post("/api/analyze", json=payload)
    # Pydantic validation throws 422 Unprocessable Entity
    assert response.status_code == 422

def test_analyze_invalid_url():
    payload = {
        "text": "This is a legitimate news article that has a length of more than fifty characters to pass the validation constraints easily.",
        "url": "not-a-valid-url"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
