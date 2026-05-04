#!/usr/bin/env bash
set -euo pipefail

python -m compileall services/recon-api/app services/recon-worker/worker
