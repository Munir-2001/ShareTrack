# #!/bin/bash
# set -e

# # Ensure this file uses Unix LF line endings (not Windows CRLF) to avoid exec format errors.

# # Start Metro Bundler on port 3000 in the background
# npx react-native start --port=3000 &

# # Wait until Metro Bundler is ready on port 3000
# until nc -z localhost 3000; do
#   echo "Waiting for Metro Bundler on port 3000..."
#   sleep 1
# done

# # Run the Android app using the specified Metro port
# exec npx react-native run-android --port=3000

#!/bin/bash
set -e

# Start Metro Bundler on port 3000 in the background
npx react-native start --port=3000 &

# Wait until Metro Bundler is ready on port 3000
until nc -z localhost 3000; do
  echo "Waiting for Metro Bundler on port 3000..."
  sleep 1
done

# Run the Android app using the specified Metro port
exec npx react-native run-android --port=3000
