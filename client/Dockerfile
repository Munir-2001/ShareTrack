# Use Node.js as base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the Metro Bundler port (default: 8081)
EXPOSE 8081

# Start Metro Bundler
CMD ["npx", "react-native", "start"]
