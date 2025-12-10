# Stage 1: Install production dependencies and collect app files
FROM node:18-alpine AS builder
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy application code and static assets
COPY src ./src
COPY public ./public

# Stage 2: Runtime image
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy built app and dependencies
COPY --from=builder /app /app

EXPOSE 3000
USER nodejs

# Start app
CMD ["node", "src/server.js"]
