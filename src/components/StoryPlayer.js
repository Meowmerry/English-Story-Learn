import React from 'react';
import VideoPlayer from './VideoPlayer';
import SkillDock from './SkillDock';
import ListeningMode from './modes/ListeningMode';
import SpeakingMode from './modes/SpeakingMode';
import ReadingMode from './modes/ReadingMode';
import WritingMode from './modes/WritingMode';
import SceneNavigation from './SceneNavigation';

const StoryPlayer = ({ story, currentSceneIndex, selectedMode, onSceneChange, onModeChange }) => {
  const currentScene = story.scenes[currentSceneIndex];

  const renderMode = () => {
    switch (selectedMode) {
      case 'listening':
        return <ListeningMode scene={currentScene} onComplete={() => handleNext()} />;
      case 'speaking':
        return <SpeakingMode scene={currentScene} />;
      case 'reading':
        return <ReadingMode scene={currentScene} />;
      case 'writing':
        return <WritingMode scene={currentScene} onComplete={() => handleNext()} />;
      default:
        return <ListeningMode scene={currentScene} onComplete={() => handleNext()} />;
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < story.scenes.length - 1) {
      onSceneChange(currentSceneIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSceneIndex > 0) {
      onSceneChange(currentSceneIndex - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Story Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {story.title}
        </h1>
        <p className="text-gray-600">{story.description}</p>
      </div>

      {/* Video Stage */}
      <div className="card mb-6">
        <VideoPlayer
          videoUrl={currentScene.videoUrl}
          mode={selectedMode}
        />
      </div>

      {/* Skill Dock */}
      <SkillDock
        selectedMode={selectedMode}
        onModeChange={onModeChange}
      />

      {/* Mode Content */}
      <div className="mt-6">
        {renderMode()}
      </div>

      {/* Scene Navigation */}
      <SceneNavigation
        currentScene={currentSceneIndex + 1}
        totalScenes={story.scenes.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={currentSceneIndex < story.scenes.length - 1}
        canGoPrevious={currentSceneIndex > 0}
      />
    </div>
  );
};

export default StoryPlayer;
