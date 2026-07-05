from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logger import logger
from app.api.routes import auth, analyze, history, feedback, health
from app.ml_models import gnn_model, nlp_model
import time

app = FastAPI(
    title="Fake News Denoising GNN API",
    description="Backend API for Graph Information Bottleneck & BERT Fake News Detection",
    version="1.2.0"
)

# CORS Configuration
# Adjust origins in production as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Events
@app.on_event("startup")
def startup_event():
    logger.info(f"Initializing Fake News Backend in {settings.ENV} mode...")
    # Pre-initialize models in background to avoid latency on first request
    try:
        gnn_model.init_gnn_model()
        nlp_model.init_nlp_model()
    except Exception as e:
        logger.error(f"Error pre-loading models on startup: {e}")

# Global request logger middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        f"Method: {request.method} | Path: {request.url.path} | "
        f"Status: {response.status_code} | Duration: {duration:.4f}s"
    )
    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An unexpected error occurred. Please try again later.",
            "detail": str(exc) if settings.ENV != "production" else None
        }
    )

# Include Routers
app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(history.router)
app.include_router(feedback.router)
app.include_router(health.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Fake News Denoising GNN API Portal",
        "docs": "/docs",
        "health": "/api/health"
    }
