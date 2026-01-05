import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StoryPlayer from './components/StoryPlayer';
import Stories from './components/Stories';
import Resources from './components/Resources';
import AboutMe from './components/AboutMe';
import StatsDisplay from './components/StatsDisplay';
import Footer from './components/Footer';
import { getAllStories } from './firebase/firestoreService';
import storiesData from './data/stories.json';

// Home Page Component
const HomePage = ({ stories, useFirebase }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-1/2 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-700 mb-6">
          StoryFlow
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Learn English through Interactive Animated Stories
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">👂</div>
            <p className="font-semibold text-gray-700">Listening</p>
          </div>
          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">🗣️</div>
            <p className="font-semibold text-gray-700">Speaking</p>
          </div>
          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">📖</div>
            <p className="font-semibold text-gray-700">Reading</p>
          </div>
          <div className="card text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">✍️</div>
            <p className="font-semibold text-gray-700">Writing</p>
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/stories')}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
          >
            Browse Stories
          </button>
          <p className="text-lg text-gray-500">
            Select a story from the sidebar or browse our complete collection!
          </p>
          {useFirebase && (
            <p className="text-sm text-green-600">
              ✅ Stories loaded from Firebase
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Story Player Wrapper Component
const StoryPlayerWrapper = ({ stories }) => {
  const { storyId } = useParams();
  const [selectedMode, setSelectedMode] = useState('listening');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const story = stories.find(s => s.id === storyId);

  const handleSceneChange = (index) => {
    if (story && index >= 0 && index < story.scenes.length) {
      setCurrentSceneIndex(index);
    }
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-1/2">
        <p className="text-gray-600 text-xl">Story not found</p>
      </div>
    );
  }

  return (
    <StoryPlayer
      story={story}
      currentSceneIndex={currentSceneIndex}
      selectedMode={selectedMode}
      onSceneChange={handleSceneChange}
      onModeChange={handleModeChange}
    />
  );
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stories, setStories] = useState(storiesData); // Initialize with local data
  const [loadingStories, setLoadingStories] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false); // Flag to check if Firebase stories are available
  const navigate = useNavigate();

  // Fetch stories from Firebase on mount
  useEffect(() => {
    const fetchStories = async () => {
      setLoadingStories(true);
      const { data, error } = await getAllStories();

      if (data && data.length > 0) {
        // Firebase stories are available
        setStories(data);
        setUseFirebase(true);
        console.log('✅ Loaded stories from Firebase');
      } else {
        // Fallback to local JSON
        setStories(storiesData);
        setUseFirebase(false);
        console.log('📁 Using local stories.json (Firebase stories not found or error:', error, ')');
      }

      setLoadingStories(false);
    };

    fetchStories();
  }, []);

  const handleStorySelect = (story) => {
    navigate(`/story/${story.id}`);
    setSidebarOpen(false);
  };

  // Show loading spinner while fetching stories
  if (loadingStories) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-3 rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Sidebar
            stories={stories}
            onStorySelect={handleStorySelect}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Loading stories...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-3 rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar */}
        <Sidebar
          stories={stories}
          onStorySelect={handleStorySelect}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<HomePage stories={stories} useFirebase={useFirebase} />} />
            <Route path="/stories" element={<Stories stories={stories} loading={loadingStories} />} />
            <Route path="/story/:storyId" element={<StoryPlayerWrapper stories={stories} />} />
            <Route path="/progress" element={<StatsDisplay />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<AboutMe />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
