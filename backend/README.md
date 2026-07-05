# Fake News Denoising GNN - FastAPI Backend

This is the backend API service for the Fake News Detection Capstone project, powered by FastAPI, SQLAlchemy, and GNN/NLP models.

## Project Structure
- `app/api/`: Endpoint routes (auth, analyze, history, feedback, health) and DB models.
- `app/ml_models/`: Deep Learning models (GNN, BERT NLP, Source Credibility, Ensemble).
- `app/services/`: Business logic services (User management, analysis, history).
- `app/utils/`: Cleaning, logger, and validation utilities.

## Setup Instructions

1. **Environment Configuration**:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

2. **Installation**:
   Install the required dependencies inside the active virtual environment:
   ```bash
   pip install -r app/requirements.txt
   ```

3. **Running the Application Locally**:
   Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Once started, you can access the interactive API documentation (Swagger) at [http://localhost:8000/docs](http://localhost:8000/docs).

4. **Running with Docker**:
   Build and start all services (FastAPI, PostgreSQL database, Redis):
   ```bash
   docker-compose up --build
   ```
