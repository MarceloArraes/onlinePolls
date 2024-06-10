#!/bin/bash

# Define the ports you want to free
PORTS=("5432" "6379")

for PORT in "${PORTS[@]}"; do
  # Find the PID associated with the port
  PID=$(sudo lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    # Kill the process
    sudo kill -9 $PID
  fi
done
