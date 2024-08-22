#!/bin/sh

. ./.env

echo "window.VITE_SERVER_URL = '${VITE_SERVER_URL}';" > env.js
echo "window.VITE_SERVER_PORT = '${VITE_SERVER_PORT}';" >> env.js
echo "window.VITE_BASE_PATH = '${VITE_BASE_PATH}';" >> env.js