#!/bin/bash
set -e

# Step 1: Build Docker image
echo "Building Docker image for the backend..."
docker build -t collabnote-backend .

# Step 2: Run Docker container
echo "Running Docker container for the backend..."
docker run -p 4000:4000 --env-file .env collabnote-backend
