import React, { useState } from 'react';
import FeedbackModal from '../FeedbackModal';
import XPNotification from '../XPNotification';
import { addXP, subtractXP, XP_VALUES } from '../../utils/xpSystem';
import { updateListeningStats } from '../../utils/statsSystem';

const ListeningMode = ({ scene, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpChange, setXpChange] = useState(0);

  const handleAnswerSelect = (option, index) => {
    setSelectedAnswer(index);
    setIsCorrect(option.isCorrect);
    setShowFeedback(true);

    // Update stats
    updateListeningStats(option.isCorrect);

    // Award or deduct XP
    if (option.isCorrect) {
      const result = addXP(XP_VALUES.CORRECT_ANSWER, 'Correct answer in listening mode');
      setXpChange(result.change);
      // Trigger custom event for XP update
      window.dispatchEvent(new Event('xpUpdate'));

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }, 2000);
    } else {
      const result = subtractXP(Math.abs(XP_VALUES.INCORRECT_ANSWER), 'Incorrect answer in listening mode');
      setXpChange(result.change);
      // Trigger custom event for XP update
      window.dispatchEvent(new Event('xpUpdate'));
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setXpChange(0);
  };

  const handleSkip = () => {
    // Skip without penalty - no XP change, no stats update for incorrect
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          👂 Listening Practice
        </h3>
        <p className="text-gray-600">
          Watch the video and choose the correct sentence you heard
        </p>
      </div>

      {/* Translation Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-1">Thai Translation:</p>
        <p className="text-lg font-medium text-gray-800">{scene.thaiTranslation}</p>
      </div>

      {/* Skip Button */}
      {!showFeedback && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Skip Question →
          </button>
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {scene.listeningOptions.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const showResult = isSelected && showFeedback;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option, index)}
              disabled={showFeedback}
              className={`
                w-full p-4 rounded-lg text-left font-medium
                transition-all duration-300 transform
                ${!showResult && 'hover:scale-102 hover:shadow-md'}
                ${showResult && option.isCorrect
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : showResult && !option.isCorrect
                  ? 'bg-red-100 border-2 border-red-500 text-red-800'
                  : 'bg-white border-2 border-gray-200 hover:border-primary-400'
                }
                ${showFeedback && !isSelected ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option.text}</span>
                {showResult && (
                  <span className="text-2xl">
                    {option.isCorrect ? '✅' : '❌'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        isCorrect={isCorrect}
        onTryAgain={handleTryAgain}
        correctAnswer={scene.transcript}
      />

      {/* XP Notification */}
      <XPNotification
        xpChange={xpChange}
        onComplete={() => setXpChange(0)}
      />
    </div>
  );
};

export default ListeningMode;
