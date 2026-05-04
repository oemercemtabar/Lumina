from fastapi import FastAPI

from app.api.rest.health import router as health_router
from app.api.rest.sessions import router as sessions_router
from app.api.ws.capture import router as capture_router
from app.core.config import get_settings


settings = get_settings()
app = FastAPI(title="Lumina Recon API", version="0.1.0")
app.include_router(health_router)
app.include_router(sessions_router, prefix="/api")
app.include_router(capture_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": settings.service_name, "status": "ok"}
