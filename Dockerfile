# Stage 1: Build the application
FROM node:18 AS build

FROM node:18-slim AS production

# Set working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]