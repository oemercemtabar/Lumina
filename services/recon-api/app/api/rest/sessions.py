from fastapi import APIRouter

from app.schemas.session import CaptureSessionSummary

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/{session_id}", response_model=CaptureSessionSummary)
async def get_session(session_id: str) -> CaptureSessionSummary:
    return CaptureSessionSummary(
        session_id=session_id,
        status="active",
        accepted_frames=0,
        coverage_score=0.0,
    )
