#!/bin/sh

echo "window.VITE_SERVER_URL = '${VITE_SERVER_URL}';" > /app/server/dist/views/env.js
echo "window.VITE_SERVER_PORT = '${VITE_SERVER_PORT}';" >> /app/server/dist/views/env.js
echo "window.VITE_BASE_PATH = '${VITE_BASE_PATH}';" >> /app/server/dist/views/env.js