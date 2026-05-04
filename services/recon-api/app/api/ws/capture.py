from fastapi import APIRouter, WebSocket

from app.schemas.websocket import NextPoseDirective

router = APIRouter(tags=["capture"])


@router.websocket("/ws/capture")
async def capture_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_json(
        NextPoseDirective(
            type="directive.next_pose",
            message="Center your face, then turn 15 degrees left.",
            target_pose={"yaw": -15.0, "pitch": 0.0, "roll": 0.0},
            hold_ms=700,
            capture_now=False,
            reason_codes=["boot", "need_left_coverage"],
        ).model_dump(mode="json")
    )
    while True:
        payload = await websocket.receive_json()
        await websocket.send_json(
            NextPoseDirective(
                type="directive.next_pose",
                message=f"Received {payload.get('type', 'event')}. Hold steady.",
                target_pose={"yaw": 0.0, "pitch": 0.0, "roll": 0.0},
                hold_ms=500,
                capture_now=True,
                reason_codes=["echo", "placeholder_feedback"],
            ).model_dump(mode="json")
        )
