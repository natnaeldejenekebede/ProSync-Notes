#!/bin/bash
set -e

echo "Cleaning backend..."
cd backend
rm -rf node_modules dist
cd ..

echo "Cleaning frontend..."
cd frontend
rm -rf node_modules dist
cd ..

echo "Cleanup completed for backend and frontend."
