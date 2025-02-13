# # Use Node.js image
# FROM node:22-alpine

# # Set working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json (if available)
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Copy all frontend files to the container
# COPY . .

# # Expose the port your React Native Metro Bundler runs on
# EXPOSE 8081

# # Command to start the frontend (Metro Bundler for React Native)
# CMD ["npx", "react-native", "start"]


# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies required for building Android apps
RUN apk add --no-cache openjdk17-jdk android-tools bash

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all frontend files to the container
COPY . .

# Expose the port for Metro Bundler
EXPOSE 8081

# Grant execution permission to entrypoint script
RUN chmod +x /usr/src/app/entrypoint.sh

# Set entrypoint to start Metro Bundler and build the Android app
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
