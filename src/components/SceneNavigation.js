import React from 'react';

const SceneNavigation = ({ currentScene, totalScenes, onNext, onPrevious, canGoNext, canGoPrevious }) => {
  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 transform
            ${canGoPrevious
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Scene Counter */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {currentScene} / {totalScenes}
          </div>
          <div className="text-sm text-gray-500">Scene</div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 transform
            ${canGoNext
              ? 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
            style={{ width: `${(currentScene / totalScenes) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SceneNavigation;
