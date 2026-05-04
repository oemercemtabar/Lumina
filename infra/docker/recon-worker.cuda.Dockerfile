FROM python:3.11-slim
WORKDIR /app
COPY services/recon-worker/pyproject.toml services/recon-worker/pyproject.toml
RUN pip install --no-cache-dir typer pydantic
COPY services/recon-worker /app/services/recon-worker
WORKDIR /app/services/recon-worker
CMD ["python", "-m", "worker.main"]
