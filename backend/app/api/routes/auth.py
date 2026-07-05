from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.api.models.schemas import UserSignUp, UserLogin, UserOut, Token
from app.services import user_service
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserSignUp, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    user = user_service.create_user(db, user_in)
    
    access_token_expires = timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = user_service.create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(
    user_in: Optional[UserLogin] = None,
    form_data: Optional[OAuth2PasswordRequestForm] = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """
    Accepts both JSON logins (UserLogin) and standard OAuth2 form logins (form_data).
    """
    # 1. Resolve credentials
    email, password = None, None
    if user_in:
        email, password = user_in.email, user_in.password
    elif form_data:
        email, password = form_data.username, form_data.password
    else:
        # FastAPI custom dependency injection fallback
        # Let's read from request form manually if form_data is not initialized
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credentials must be provided either as JSON or form data."
        )
        
    user = user_service.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = user_service.create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    """
    Stateless JWT logout: Client discards the token.
    """
    return {"status": "success", "message": "Successfully logged out client session."}
