import React from 'react';

const FeedbackModal = ({ isOpen, isCorrect, onTryAgain, correctAnswer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onTryAgain} />

      <div className={`
        relative bg-white rounded-2xl p-8 max-w-md w-full
        shadow-2xl transform transition-all duration-300
        animate-bounce-subtle
      `}>
        {isCorrect ? (
          <>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-subtle">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">
                Great Job!
              </h3>
              <p className="text-xl text-green-700 mb-2">เก่งมาก!</p>
              <p className="text-gray-600">
                That's the correct answer!
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-3xl font-bold text-yellow-600 mb-2">
                Try Again!
              </h3>
              <p className="text-xl text-yellow-700 mb-2">ลองอีกครั้ง!</p>
              <p className="text-gray-600 mb-4">
                Listen carefully and try again
              </p>
              {correctAnswer && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Hint:</p>
                  <p className="text-gray-800 font-medium">{correctAnswer}</p>
                </div>
              )}
              <button
                onClick={onTryAgain}
                className="mt-6 btn-primary w-full"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
