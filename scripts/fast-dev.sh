#!/bin/bash

# Fast development startup script
echo "🚀 Starting Spora One Trust Portal in FAST mode..."

# Set ultra-fast development environment
export VITE_FAST_DEV_MODE=true
export VITE_MOCK_API=true
export NODE_ENV=development

# Clear Vite cache for fresh start
rm -rf dist
rm -rf node_modules/.cache

echo "✅ Environment configured for fast development"
echo "📦 Starting Vite with optimizations..."

# Start with fast reload and optimizations
npm run dev

echo "🎉 Portal started! Visit http://localhost:5173"
