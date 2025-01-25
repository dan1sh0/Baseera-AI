#!/bin/bash

# Start backend
cd backend
source venv/bin/activate
python main.py &

# Start frontend
cd ../frontend
npm run dev &

# Wait for both processes
wait 