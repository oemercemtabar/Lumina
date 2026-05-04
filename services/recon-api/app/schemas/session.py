from typing import Literal

from pydantic import BaseModel


class CaptureSessionSummary(BaseModel):
    session_id: str
    status: Literal["active", "processing", "completed", "failed"]
    accepted_frames: int
    coverage_score: float
