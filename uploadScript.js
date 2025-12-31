import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDkQs6hjrnL3C0LIimZhHAphLaYRU3Etpo",
  authDomain: "storyflow-english-learning.firebaseapp.com",
  projectId: "storyflow-english-learning",
  storageBucket: "storyflow-english-learning.firebasestorage.app",
  messagingSenderId: "449653527865",
  appId: "1:449653527865:web:9bbc3c74e75f6c64a6677d",
  measurementId: "G-GQMV5VT29W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('✅ Firebase initialized');

// Load stories from stories.json
async function loadStories() {
  const response = await fetch('./src/data/stories.json');
  return await response.json();
}

const uploadBtn = document.getElementById('uploadBtn');
const statusDiv = document.getElementById('status');

uploadBtn.addEventListener('click', async () => {
  uploadBtn.disabled = true;
  uploadBtn.textContent = '⏳ Uploading...';
  statusDiv.innerHTML = '<p class="info">Loading stories...</p>';

  try {
    const stories = await loadStories();
    statusDiv.innerHTML += `<p class="info">Found ${stories.length} stories. Starting upload...</p>`;

    let successCount = 0;
    let failCount = 0;

    for (const story of stories) {
      try {
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

        successCount++;
        statusDiv.innerHTML += `<p class="success">✅ ${successCount}/${stories.length} - ${story.title} (${story.totalScenes} scenes)</p>`;
        console.log(`✅ Uploaded: ${story.title}`);

        // Scroll to bottom after each upload
        statusDiv.scrollTop = statusDiv.scrollHeight;
      } catch (error) {
        failCount++;
        statusDiv.innerHTML += `<p class="error">❌ Failed: ${story.title} - ${error.message}</p>`;
        console.error(`❌ Failed: ${story.title}`, error);
      }
    }

    statusDiv.innerHTML += `<hr><p class="success"><strong>🎉 Upload Complete!</strong></p>`;
    statusDiv.innerHTML += `<p class="info">✅ Successful: ${successCount} stories</p>`;
    if (failCount > 0) {
      statusDiv.innerHTML += `<p class="error">❌ Failed: ${failCount} stories</p>`;
    }
    statusDiv.innerHTML += `<div class="warning"><strong>⚠️ IMPORTANT:</strong> Now go to Firebase Console and change Firestore rules back to secure mode:<br><code>allow write: if false;</code></div>`;

    uploadBtn.textContent = '✅ Upload Complete!';
  } catch (error) {
    statusDiv.innerHTML += `<p class="error"><strong>❌ Error:</strong> ${error.message}</p>`;
    console.error('Error:', error);
    uploadBtn.disabled = false;
    uploadBtn.textContent = '🔄 Try Again';
  }

  // Scroll to bottom
  statusDiv.scrollTop = statusDiv.scrollHeight;
});
