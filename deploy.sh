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
    echo "🔥 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🌐 Your app is live at:"
        echo "   https://storyflow-english-learning.web.app"
        echo "   https://storyflow-english-learning.firebaseapp.com"
    else
        echo "❌ Deployment failed!"
    fi
else
    echo "❌ Build failed! Please fix errors and try again."
fi
