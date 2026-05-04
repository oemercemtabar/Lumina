from worker.pipelines.export_pipeline import export_job_summary


def main() -> None:
    print("Lumina recon worker booted")
    print(export_job_summary("local-dev"))


if __name__ == "__main__":
    main()
