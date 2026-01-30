# syntax=docker/dockerfile:1

# Base stage for all other stages
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Dependencies stage
FROM base AS deps
# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY demo/corsair-fly ./demo/corsair-fly
# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile --filter=@corsair/demo-fly...

# Build stage
FROM base AS builder
WORKDIR /app
# Copy workspace structure and dependencies
COPY --from=deps /app ./
# Copy all source files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY demo/corsair-fly ./demo/corsair-fly

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
WORKDIR /app/demo/corsair-fly
RUN pnpm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from the workspace build
COPY --from=builder /app/demo/corsair-fly/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/demo/corsair-fly/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/demo/corsair-fly/.next/static ./demo/corsair-fly/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "demo/corsair-fly/server.js"]
