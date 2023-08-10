# Stage 1: Build the Vue app
FROM node:18 as client-builder
# ENV VITE_SERVER_URL "http://localhost"
# ENV VITE_SERVER_PORT "3000"
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build the Express server
FROM node:18 as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN npm run build

# Stage 3: Create the final image
FROM node:20-alpine
WORKDIR /app 
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./server/dist/views
COPY server/package*.json ./
RUN npm install --production

# Stage 4: Copy env-var bash script
COPY env.sh /app/env.sh
RUN chmod +x /app/env.sh

RUN ls
RUN cd /app 
RUN ls

EXPOSE 3000

# Start the server
CMD ["/bin/sh", "-c", "./env.sh && node ./server/dist/app.js"]