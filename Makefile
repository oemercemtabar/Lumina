SHELL := /bin/zsh

.PHONY: bootstrap dev web desktop api worker format lint test

bootstrap:
	pnpm install
	uv sync

dev:
	pnpm --filter director-desktop dev

desktop:
	pnpm --filter director-desktop dev

web:
	pnpm --filter director-web dev

api:
	uv run --project services/recon-api uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

worker:
	uv run --project services/recon-worker python -m worker.main

format:
	pnpm -r format
	uv run ruff format .

lint:
	pnpm -r lint
	uv run ruff check .

test:
	pnpm -r test
	uv run pytest
