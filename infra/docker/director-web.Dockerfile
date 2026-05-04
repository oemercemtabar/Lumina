FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/director-web/package.json apps/director-web/package.json
COPY packages/protocol/package.json packages/protocol/package.json
RUN corepack enable && pnpm install
COPY . .
WORKDIR /app/apps/director-web
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
