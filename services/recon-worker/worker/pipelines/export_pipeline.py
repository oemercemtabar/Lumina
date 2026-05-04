def export_job_summary(session_id: str) -> dict[str, object]:
    return {
        "session_id": session_id,
        "stage": "export",
        "artifacts": [
            "head.glb",
            "head.obj",
            "flame_params.npz",
            "gaussians.ply",
        ],
    }
