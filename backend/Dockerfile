# --- Stage 1: Build Dependencies ---
FROM python:3.11-slim AS builder

WORKDIR /build

# Install compilation build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY app/requirements.txt .

# Install dependencies to a local folder to easily copy in next stage
RUN pip install --no-cache-dir --user -r requirements.txt

# --- Stage 2: Final Image ---
FROM python:3.11-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
COPY .env.example .env

# Ensure PATH includes local packages bin
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

# Copy application source
COPY app/ ./app/

# Expose FastAPI default port
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
