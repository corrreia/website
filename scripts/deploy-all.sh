#!/bin/bash

set -e

echo "🚀 Deploying Real-Time Chat System to Cloudflare..."

# Step 1: Deploy the Durable Object Worker first
echo "📦 Step 1: Deploying Durable Object Worker..."
cd website-do
npm run deploy
echo "✅ Durable Object Worker deployed successfully!"

# Step 2: Go back to root and deploy main app
echo "📦 Step 2: Deploying Main Application..."
cd ..
npm run deploy
echo "✅ Main Application deployed successfully!"

echo "🎉 Deployment complete! Your real-time chat system is now live."
echo "💬 Users can now chat in real-time on your website." 