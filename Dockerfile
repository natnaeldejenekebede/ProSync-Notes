# Stage 1: Backend Build
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./
RUN npm install --include=dev
COPY backend/ .
RUN npm run build

# Stage 2: Frontend Build
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 3: Production Image
FROM nginx:alpine AS production
WORKDIR /app

# Copy backend build artifacts
WORKDIR /app/backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./
RUN npm install --omit=dev

# Copy frontend build artifacts
WORKDIR /usr/share/nginx/html
COPY --from=frontend-builder /app/frontend/dist .

# Expose ports for both services
EXPOSE 4000 80

# Start the backend and frontend servers
CMD ["sh", "-c", "node /app/backend/dist/main.js & nginx -g 'daemon off;'"]
