#!/bin/bash
echo "Stopping all running processes..."
kill $(jobs -p)
echo "All processes stopped."
