# V1 Desktop Plan

## Product Shape

Lumina v1 is a local desktop tool for building a neutral full-head GLB from a laptop webcam capture on Apple Silicon macOS.

## Capture Sequence

1. Centered front pose
2. Front-left
3. Left
4. Front-right
5. Right
6. Slight chin-up
7. Stabilization hold for best neutral frame

## Acceptance Rules

- stable landmarks
- low motion blur
- sufficient exposure
- neutral expression
- adequate coverage novelty

## Reconstruction Path

1. Select best accepted frames
2. Solve coarse camera and head pose
3. Fit FLAME neutral head
4. Inflate outer shell for rough hair inclusion
5. Project texture to atlas
6. Export GLB

## Explicit Non-Goals For V1

- photorealistic strands of hair
- expression rigging
- multi-user sessions
- cloud inference
- full 3DGS optimization as the default path
