#!/bin/bash
set -e

# Start backend
echo "Starting backend server..."
cd backend
npm run start & # Run backend in the background
cd ..

# Start frontend
echo "Starting frontend server..."
cd frontend
npm run preview & # Run frontend in the background
cd ..

echo "Both backend and frontend are running."
