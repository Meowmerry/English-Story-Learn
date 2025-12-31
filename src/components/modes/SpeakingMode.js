import React, { useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { calculateSimilarity } from '../../utils/stringUtils';
import XPNotification from '../XPNotification';
import { addXP, subtractXP, XP_VALUES } from '../../utils/xpSystem';
import { updateSpeakingStats } from '../../utils/statsSystem';

const SpeakingMode = ({ scene, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);
  const [xpChange, setXpChange] = useState(0);
  const { startListening, stopListening, isSupported } = useSpeechRecognition();

  const handleSkip = () => {
    // Skip without penalty - no XP change, no stats update
    if (onComplete) {
      onComplete();
    }
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setTranscript('');
    setScore(null);
    setXpChange(0);

    const result = await startListening();
    if (result) {
      setTranscript(result);
      const similarity = calculateSimilarity(scene.transcript, result);
      setScore(similarity);

      // Update stats
      updateSpeakingStats(similarity);

      // Award XP based on score
      if (similarity >= 85) {
        const xpResult = addXP(XP_VALUES.CORRECT_ANSWER, 'Excellent speaking score');
        setXpChange(xpResult.change);
        window.dispatchEvent(new Event('xpUpdate'));
      } else if (similarity >= 70) {
        const xpResult = addXP(50, 'Good speaking score');
        setXpChange(xpResult.change);
        window.dispatchEvent(new Event('xpUpdate'));
      } else {
        const xpResult = subtractXP(Math.abs(XP_VALUES.INCORRECT_ANSWER), 'Low speaking score');
        setXpChange(xpResult.change);
        window.dispatchEvent(new Event('xpUpdate'));
      }
    }
    setIsRecording(false);
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 85) return 'Excellent! 🎉';
    if (score >= 70) return 'Good job! Keep practicing! 👍';
    return 'Keep trying! You can do it! 💪';
  };

  if (!isSupported) {
    return (
      <div className="card animate-slide-up">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Speech Recognition Not Supported
          </h3>
          <p className="text-gray-600">
            Your browser doesn't support speech recognition. Please try using Chrome or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🗣️ Speaking Practice
        </h3>
        <p className="text-gray-600">
          Listen to the video, then record yourself saying the sentence
        </p>
      </div>

      {/* Target Sentence */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-2">Say this sentence:</p>
        <p className="text-2xl font-bold text-gray-800 mb-3">{scene.transcript}</p>
        <p className="text-gray-600 italic">{scene.thaiTranslation}</p>
      </div>

      {/* Skip Button */}
      {!isRecording && !transcript && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Skip Question →
          </button>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isRecording}
          className={`
            w-32 h-32 rounded-full flex items-center justify-center text-6xl
            transition-all duration-300 transform
            ${isRecording
              ? 'bg-red-500 animate-pulse cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 hover:scale-110 active:scale-95'
            }
            shadow-lg hover:shadow-xl
          `}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
        <p className="mt-4 text-gray-600 font-medium">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
      </div>

      {/* Transcript Result */}
      {transcript && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 animate-fade-in">
          <p className="text-sm text-gray-600 mb-2">You said:</p>
          <p className="text-xl font-medium text-gray-800 mb-4">{transcript}</p>

          {score !== null && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Accuracy Score:</span>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-center mt-3 text-lg font-semibold text-gray-700">
                {getScoreMessage(score)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Speak clearly and at a natural pace</li>
          <li>• Try to match the pronunciation from the video</li>
          <li>• Practice multiple times to improve your score</li>
          <li>• Score 85%+ for full XP, 70%+ for partial XP</li>
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

export default SpeakingMode;
