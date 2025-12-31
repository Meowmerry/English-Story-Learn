// Script to upload stories from stories.json to Firebase Firestore
// Run this once to migrate your stories to Firebase

import { db } from '../firebase/config.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import storiesData from '../data/stories.json';

const uploadStories = async () => {
  try {
    console.log('Starting story upload to Firestore...');

    for (const story of storiesData) {
      const storyRef = doc(db, 'stories', story.id);

      await setDoc(storyRef, {
        id: story.id,
        title: story.title,
        description: story.description,
        thumbnail: story.thumbnail,
        difficulty: story.difficulty,
        totalScenes: story.totalScenes,
        scenes: story.scenes,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true
      });

      console.log(`✅ Uploaded: ${story.title}`);
    }

    console.log('\n🎉 All stories uploaded successfully!');
    console.log(`Total stories: ${storiesData.length}`);

  } catch (error) {
    console.error('❌ Error uploading stories:', error);
  }
};

// Run the upload
uploadStories();
