#!/bin/bash
set -e

# Step 1: Install dependencies
echo "Installing frontend dependencies..."
npm install

# Step 2: Build the frontend
echo "Building the frontend..."
npm run build

# Step 3: Start the frontend in preview mode
echo "Starting the frontend preview server..."
npm run preview
