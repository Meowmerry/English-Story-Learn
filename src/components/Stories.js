import React from 'react';

const Stories = ({ stories, onStorySelect }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">Story Library</h1>
        <p className="text-lg text-gray-600">
          Explore our collection of interactive animated stories designed to improve
          your English skills. Each story includes listening, speaking, reading, and
          writing exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="card cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
            onClick={() => onStorySelect(story)}
          >
            {/* Story Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-primary-200 to-secondary-200 rounded-lg mb-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🎬
              </div>
            </div>

            {/* Story Info */}
            <h3 className="font-bold text-xl text-gray-800 mb-2">
              {story.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {story.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getDifficultyColor(story.difficulty)}`}>
                {story.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {story.totalScenes} scenes
              </span>
            </div>

            {/* Read Story Button */}
            <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              Start Learning
            </button>
          </div>
        ))}
      </div>

      {/* Story Details Section */}
      <div className="mt-12 card bg-primary-50 border-2 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          How to Use Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-start space-x-3 mb-3">
              <span className="text-2xl">👂</span>
              <div>
                <h3 className="font-bold text-gray-800">Listening Mode</h3>
                <p className="text-sm text-gray-600">
                  Watch and listen to the story, then answer comprehension questions.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mb-3">
              <span className="text-2xl">🗣️</span>
              <div>
                <h3 className="font-bold text-gray-800">Speaking Mode</h3>
                <p className="text-sm text-gray-600">
                  Practice pronunciation by repeating the dialogues.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start space-x-3 mb-3">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="font-bold text-gray-800">Reading Mode</h3>
                <p className="text-sm text-gray-600">
                  Read the story transcript with translations and vocabulary.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✍️</span>
              <div>
                <h3 className="font-bold text-gray-800">Writing Mode</h3>
                <p className="text-sm text-gray-600">
                  Practice writing by transcribing what you hear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
