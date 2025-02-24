
# # Use Node.js 22 Alpine as the base image
# FROM node:22-alpine

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Install required packages:
# # - openjdk17-jdk: For Android builds.
# # - android-tools: For Android command-line tools.
# # - bash: For shell commands.
# # - netcat-openbsd: To wait for Metro Bundler to be ready.
# RUN apk add --no-cache openjdk17-jdk android-tools bash netcat-openbsd

# # Copy package files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install --legacy-peer-deps

# # Copy the rest of the application code
# COPY . .

# # Ensure the Gradle wrapper is executable (assumes it's in the android folder)
# RUN chmod +x android/gradlew

# # Expose the port used by Metro Bundler (3000)
# EXPOSE 3000

# # Start Metro Bundler on port 3000, wait until it’s ready, then run the Android app.
# CMD sh -c "npx react-native start --port=3000 & \
#            until nc -z localhost 3000; do echo 'Waiting for Metro Bundler on port 3000...'; sleep 1; done; \
#            npx react-native run-android --port=3000"

# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install required packages:
# - openjdk17-jdk: For Android builds.
# - android-tools: For Android command-line tools.
# - bash: For shell commands.
# - netcat-openbsd: To wait for Metro Bundler.
RUN apk add --no-cache openjdk17-jdk android-tools bash netcat-openbsd

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Ensure the Gradle wrapper is executable (located in android/gradlew)
RUN chmod +x android/gradlew

# Create a symlink in the root directory to point to android/gradlew
RUN ln -s android/gradlew gradlew

# Expose the port used by Metro Bundler (3000)
EXPOSE 3000

# Start Metro Bundler on port 3000 in the background, wait until it's ready,
# then run the Android app with the specified Metro port.
CMD sh -c "npx react-native start --port=3000 & \
           until nc -z localhost 3000; do echo 'Waiting for Metro Bundler on port 3000...'; sleep 1; done; \
           npx react-native run-android --port=3000"
