# Multi-stage build for optimal performance
FROM node:18-alpine AS base

# Install dumb-init and curl for proper signal handling and health checks
RUN apk add --no-cache dumb-init curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Production dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["dumb-init", "node", "index.js"]

# Production stage
FROM base AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["dumb-init", "node", "index.js"]