# ==============================================================================
# Multi-Stage Dockerfile for Next.js Frontend
# ==============================================================================

# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies needed for build
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy application source
COPY . .

# Set production environment and build Next.js standalone
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy built public files and standalone assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

