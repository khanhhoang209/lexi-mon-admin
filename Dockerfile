# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments
ARG VITE_BACKEND_URL
ARG VITE_APP_TITLE
ARG VITE_APP_DESCRIPTION
ARG NODE_ENV=production

# Set environment variables
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION
ENV NODE_ENV=$NODE_ENV

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]