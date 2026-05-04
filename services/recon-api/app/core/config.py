from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = "lumina-recon-api"
    environment: str = "development"
    redis_url: str = "redis://localhost:6379/0"
    database_url: str = "postgresql://lumina:lumina@localhost:5432/lumina"

    model_config = SettingsConfigDict(env_prefix="LUMINA_", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
