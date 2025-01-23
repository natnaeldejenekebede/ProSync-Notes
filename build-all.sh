#!/bin/bash
set -e

echo "Building backend..."
cd backend
npm install
npm run build
cd ..

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build completed for both backend and frontend."
