#!/bin/bash

# Exit immediately if a command fails
set -e

echo "🔧 Starting production build with source maps disabled..."

# Step 1: Set environment variable and build
export GENERATE_SOURCEMAP=false
npm run build

echo "✅ Build completed."

# Step 2: Obfuscate JavaScript files
echo "🔒 Obfuscating JavaScript files..."

npx javascript-obfuscator build/static/js --output build/static/js-obf

echo "✅ Obfuscation completed."

# Step 3: Replace original JS with obfuscated ones
echo "🧹 Replacing original JS files with obfuscated files..."

rm -rf build/static/js
mv build/static/js-obf build/static/js

echo "✅ Replacement done. Build is ready for deployment with obfuscated JS."

cp build/* -R ../ndfront_build/
