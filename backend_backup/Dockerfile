# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Ensure ES Module support
RUN echo '{ "type": "module" }' > package.json

# Expose the backend port
EXPOSE 5001

# Command to start the backend service
CMD ["node", "src/index.js"]
