#!/bin/bash
cd "$(dirname "$0")"
PATH="/tmp/node-v22.14.0-darwin-x64/bin:$PATH"
nohup node server/index.js > server.log 2>&1 &
echo "Server started! Open http://localhost:3001 in your browser."
echo "Log file: server.log"
echo ""
echo "To stop the server, run: kill \$(lsof -ti:3001)"
