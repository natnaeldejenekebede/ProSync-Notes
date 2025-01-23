# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output to nginx HTML directory
COPY --from=builder /app/dist .

# Expose the port and start the server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
