import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.api.dependencies import get_db
from app.api.models.database import Base

# Set up test SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def run_around_tests():
    # Setup: Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown: Clean tables
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_signup_success():
    payload = {
        "email": "testuser@example.com",
        "password": "strongpassword123"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_signup_duplicate_email():
    payload = {
        "email": "duplicate@example.com",
        "password": "password123"
    }
    # First signup
    client.post("/api/auth/signup", json=payload)
    # Second signup with same email
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success():
    signup_payload = {
        "email": "loginuser@example.com",
        "password": "loginpassword123"
    }
    # Register
    client.post("/api/auth/signup", json=signup_payload)
    
    # Login JSON format
    login_payload = {
        "email": "loginuser@example.com",
        "password": "loginpassword123"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_credentials():
    login_payload = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 401
    assert "Incorrect email" in response.json()["detail"]

def test_logout():
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
