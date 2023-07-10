# Stage 1: Build the Vue app
FROM node:14 as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build the Express server
FROM node:14 as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN npm run build


# Stage 3: Create the final image
FROM node:14-alpine
WORKDIR /app 
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./server/dist/views
COPY server/package*.json ./
RUN npm install --production

EXPOSE 3000

# Start the server
CMD ["node", "./server/dist/app.js"]