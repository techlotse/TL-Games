# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Build stage - compile the production bundle
# ----------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app
ENV CI=true

# Install dependencies from the lockfile first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Build the static site (tsc type-check + vite build + PWA service worker).
COPY . .
RUN npm run build

# ----------------------------------------------------------------------------
# Runtime stage - serve the static site
# ----------------------------------------------------------------------------
# nginx-unprivileged runs as a non-root user (uid 101) and listens on :8080.
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

LABEL org.opencontainers.image.title="Spielgarten" \
      org.opencontainers.image.description="Calm, Montessori-inspired toddler game platform (PWA)." \
      org.opencontainers.image.source="https://github.com/techlotse/TL-Games" \
      org.opencontainers.image.licenses="UNLICENSED"

# Site configuration (SPA routing, security headers, caching).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output only - no Node.js, no source, no dependencies ship.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1
