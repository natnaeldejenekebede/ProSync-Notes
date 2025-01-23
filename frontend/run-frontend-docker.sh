#!/bin/bash
set -e

# Step 1: Build Docker image
echo "Building Docker image for the frontend..."
docker build -t collabnote-frontend .

# Step 2: Run Docker container
echo "Running Docker container for the frontend..."
docker run -p 3000:3000 collabnote-frontend
