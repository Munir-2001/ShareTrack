# Use official Node.js image
FROM node:22-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "dev"]
