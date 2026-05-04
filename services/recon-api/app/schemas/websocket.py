from typing import Literal

from pydantic import BaseModel


class TargetPose(BaseModel):
    yaw: float
    pitch: float
    roll: float


class NextPoseDirective(BaseModel):
    type: Literal["directive.next_pose"]
    message: str
    target_pose: TargetPose
    hold_ms: int
    capture_now: bool
    reason_codes: list[str]
