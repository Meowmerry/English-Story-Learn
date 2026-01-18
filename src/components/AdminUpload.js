import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import storiesData from '../data/stories.json';

const AdminUpload = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([{ type: 'info', message: 'Ready to upload. Click the button above to start.' }]);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Redirect if not admin
  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-1/2 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const addLog = (type, message) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const handleUpload = async () => {
    setUploading(true);
    setLogs([{ type: 'info', message: `Loading ${storiesData.length} stories...` }]);

    let successCount = 0;
    let failCount = 0;

    for (const story of storiesData) {
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
        addLog('success', `${successCount}/${storiesData.length} - ${story.title} (${story.totalScenes} scenes)`);
      } catch (error) {
        failCount++;
        addLog('error', `Failed: ${story.title} - ${error.message}`);
      }
    }

    addLog('success', `Upload Complete! Successful: ${successCount} stories`);
    if (failCount > 0) {
      addLog('error', `Failed: ${failCount} stories`);
    }

    setUploading(false);
    setUploadComplete(true);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Upload Stories to Firebase
        </h1>
        <p className="text-gray-600 text-center mb-6">Admin Panel</p>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <span className="text-yellow-400 text-xl mr-3">!</span>
            <div>
              <p className="font-semibold text-yellow-800">Before uploading:</p>
              <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
                <li>Update Firestore rules to allow writes temporarily</li>
                <li>After upload, change rules back to secure mode</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || uploadComplete}
          className={`
            w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors mb-6
            ${uploading || uploadComplete
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-green-500 hover:bg-green-600 text-white'
            }
          `}
        >
          {uploading ? 'Uploading...' : uploadComplete ? 'Upload Complete!' : 'Upload Stories to Firestore'}
        </button>

        {/* Status Logs */}
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <p
              key={index}
              className={`
                text-sm py-1
                ${log.type === 'success' ? 'text-green-600' : ''}
                ${log.type === 'error' ? 'text-red-600' : ''}
                ${log.type === 'info' ? 'text-blue-600' : ''}
              `}
            >
              {log.type === 'success' && '✓ '}
              {log.type === 'error' && '✗ '}
              {log.type === 'info' && 'ℹ '}
              {log.message}
            </p>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminUpload;
