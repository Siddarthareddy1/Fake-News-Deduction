import time
from typing import Generator, Optional, Dict, List
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
from app.api.models.database import Base, User
from app.utils.logger import logger
import redis

# Initialize Database Engine
# Check if using SQLite to add thread compatibility argument
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Auto-create tables on startup (Fallback to Alembic in production)
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT Config
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=True)
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_optional_current_user(token: Optional[str] = Depends(optional_oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except JWTError:
        pass
    return None

# Redis rate limiter client
redis_client = None
if settings.REDIS_URL:
    try:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        logger.info("Successfully connected to Redis for rate-limiting.")
    except Exception as e:
        logger.warning(f"Failed to connect to Redis: {e}. Falling back to in-memory rate limiting.")

# Local in-memory sliding window rate limiter fallback
# Schema: {identifier: [timestamps_of_requests]}
in_memory_rate_limits: Dict[str, List[float]] = {}

def check_sliding_window_limit(key: str, limit: int, window_seconds: int = 86400) -> bool:
    """
    Sliding window rate limiter: Returns True if request is allowed, False if limit exceeded.
    """
    now = time.time()
    cutoff = now - window_seconds
    
    # 1. Use Redis if available
    if redis_client:
        try:
            # Multi-transaction to ensure atomicity
            pipe = redis_client.pipeline()
            pipe.zremrangebyscore(key, 0, cutoff) # Prune old requests
            pipe.zcard(key)                       # Get count
            pipe.zadd(key, {str(now): now})       # Add current request timestamp
            pipe.expire(key, window_seconds)      # Set expiry
            _, current_count, _, _ = pipe.execute()
            return current_count <= limit
        except Exception as e:
            logger.error(f"Redis rate limiter error: {e}. Falling back to memory.")
            
    # 2. Local in-memory fallback
    if key not in in_memory_rate_limits:
        in_memory_rate_limits[key] = []
        
    # Prune old timestamps
    in_memory_rate_limits[key] = [t for t in in_memory_rate_limits[key] if t > cutoff]
    
    if len(in_memory_rate_limits[key]) >= limit:
        return False
        
    in_memory_rate_limits[key].append(now)
    return True

async def rate_limiter(
    request: Request,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Identify client
    if current_user:
        identifier = f"rate:user:{current_user.id}"
        tier = current_user.subscription_tier.lower()
        limit = settings.PRO_TIER_LIMIT if tier == "pro" else settings.FREE_TIER_LIMIT
    else:
        # Guest user rates: limit using client IP
        client_ip = request.client.host if request.client else "unknown"
        identifier = f"rate:ip:{client_ip}"
        limit = settings.FREE_TIER_LIMIT
        
    # Check rate limit (sliding window over 1 day = 86400 seconds)
    if not check_sliding_window_limit(identifier, limit, 86400):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later or upgrade your subscription."
        )
