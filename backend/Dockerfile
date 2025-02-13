# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies for bcrypt
RUN apk add --no-cache python3 make g++ 

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Ensure bcrypt is properly built
RUN npm rebuild bcrypt --build-from-source

# Expose the port
EXPOSE 5001

# Run the server
CMD ["node", "src/index.js"]
