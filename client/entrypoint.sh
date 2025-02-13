#!/bin/bash

# Start Metro Bundler in the background
npx react-native start &

# Wait for Metro Bundler to initialize
sleep 5

# Run the Android app
npx react-native run-android
