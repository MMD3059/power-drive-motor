#!/bin/bash
kill $(lsof -ti:3001) 2>/dev/null
echo "Server stopped (if it was running)."
