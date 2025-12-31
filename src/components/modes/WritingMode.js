import React, { useState } from 'react';
import { normalizeText, calculateSimilarity } from '../../utils/stringUtils';
import XPNotification from '../XPNotification';
import { addXP, subtractXP, XP_VALUES } from '../../utils/xpSystem';
import { updateWritingStats } from '../../utils/statsSystem';

const WritingMode = ({ scene, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [xpChange, setXpChange] = useState(0);

  const handleCheck = () => {
    setIsChecking(true);
    const normalizedInput = normalizeText(userInput);
    const normalizedCorrect = normalizeText(scene.transcript);

    const similarity = calculateSimilarity(normalizedCorrect, normalizedInput);
    const isCorrect = similarity >= 90;

    setResult({
      isCorrect,
      similarity,
      userAnswer: userInput,
      correctAnswer: scene.transcript
    });

    // Update stats
    updateWritingStats(similarity);

    // Award XP based on similarity score
    if (similarity >= 90) {
      const xpResult = addXP(XP_VALUES.CORRECT_ANSWER, 'Perfect writing answer');
      setXpChange(xpResult.change);
      window.dispatchEvent(new Event('xpUpdate'));
    } else if (similarity >= 75) {
      const xpResult = addXP(50, 'Good writing attempt');
      setXpChange(xpResult.change);
      window.dispatchEvent(new Event('xpUpdate'));
    } else {
      const xpResult = subtractXP(Math.abs(XP_VALUES.INCORRECT_ANSWER), 'Low writing accuracy');
      setXpChange(xpResult.change);
      window.dispatchEvent(new Event('xpUpdate'));
    }

    if (isCorrect && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setIsChecking(false);
    setResult(null);
    setXpChange(0);
  };

  const handleSkip = () => {
    // Skip without penalty - no XP change, no stats update
    if (onComplete) {
      onComplete();
    }
  };

  const getHint = () => {
    if (userInput.length < 3) return '';

    const words = scene.transcript.split(' ');
    const userWords = userInput.split(' ');

    if (userWords.length < words.length) {
      return `Hint: The sentence has ${words.length} words. Keep going!`;
    }

    return 'You\'re doing great! Check your answer when ready.';
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          ✍️ Writing Practice
        </h3>
        <p className="text-gray-600">
          Watch the video and type exactly what you hear
        </p>
      </div>

      {/* Translation Reference */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-1">Thai Translation (Hint):</p>
        <p className="text-lg font-medium text-gray-800">{scene.thaiTranslation}</p>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type what you heard:
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isChecking}
          placeholder="Start typing here..."
          className={`
            w-full p-4 border-2 rounded-lg text-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-200
            ${result?.isCorrect
              ? 'border-green-500 bg-green-50'
              : result && !result.isCorrect
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          rows="4"
        />

        {/* Hint */}
        {!result && userInput && (
          <p className="text-sm text-primary-600 mt-2 animate-fade-in">
            {getHint()}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        {!isChecking ? (
          <>
            <button
              onClick={handleCheck}
              disabled={!userInput.trim()}
              className={`
                flex-1 py-3 px-6 rounded-lg font-semibold
                transition-all duration-200 transform
                ${userInput.trim()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Check Answer
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Skip →
            </button>
          </>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 btn-secondary"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className={`
          p-6 rounded-lg border-2 animate-fade-in
          ${result.isCorrect
            ? 'bg-green-50 border-green-500'
            : 'bg-yellow-50 border-yellow-500'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-800">
              {result.isCorrect ? '🎉 Perfect!' : '👍 Almost There!'}
            </h4>
            <span className={`
              text-3xl font-bold
              ${result.similarity >= 90 ? 'text-green-600' : result.similarity >= 75 ? 'text-yellow-600' : 'text-orange-600'}
            `}>
              {result.similarity}%
            </span>
          </div>

          {!result.isCorrect && (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                <p className="text-lg text-gray-800 font-medium">{result.userAnswer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                <p className="text-lg text-green-700 font-medium">{result.correctAnswer}</p>
              </div>
            </div>
          )}

          {result.isCorrect && (
            <p className="text-gray-700">
              Excellent work! Your spelling and punctuation are perfect!
            </p>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-orange-50 p-4 rounded-lg mt-6">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Writing Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Listen to the video multiple times if needed</li>
          <li>• Don't worry about perfect punctuation - focus on the words</li>
          <li>• Use the Thai translation as a hint if you're stuck</li>
          <li>• Score 90%+ for full XP, 75%+ for partial XP</li>
        </ul>
      </div>

      {/* XP Notification */}
      <XPNotification
        xpChange={xpChange}
        onComplete={() => setXpChange(0)}
      />
    </div>
  );
};

export default WritingMode;
