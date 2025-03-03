FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json for server
COPY server/package*.json ./server/

# Install dependencies for server
WORKDIR /app/server
RUN npm install --production

# Copy server files only
COPY server ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose the port the server runs on
EXPOSE 5001

# Start the server
CMD ["npm", "start"] 