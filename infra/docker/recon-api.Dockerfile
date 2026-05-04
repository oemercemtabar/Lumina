FROM python:3.11-slim
WORKDIR /app
COPY services/recon-api/pyproject.toml services/recon-api/pyproject.toml
RUN pip install --no-cache-dir fastapi uvicorn pydantic pydantic-settings websockets
COPY services/recon-api /app/services/recon-api
WORKDIR /app/services/recon-api
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
