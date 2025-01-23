#!/bin/bash
set -e

# Step 1: Install dependencies
echo "Installing backend dependencies..."
npm install

# Step 2: Build the backend
echo "Building the backend..."
npm run build

# Step 3: Start the backend
echo "Starting the backend server..."
npm run start
