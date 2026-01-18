#!/bin/bash

echo "🚀 StoryFlow Deployment Script"
echo "=============================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "📦 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🔥 Deploying to Firebase (Hosting + Functions)..."
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🌐 Your app is live at:"
        echo "   Frontend: https://storyflow-english-learning.web.app"
        echo "   Backend:  https://us-central1-storyflow-english-learning.cloudfunctions.net/api"
    else
        echo "❌ Deployment failed!"
    fi
else
    echo "❌ Build failed! Please fix errors and try again."
fi
