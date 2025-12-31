import React, { useState } from 'react';

const ReadingMode = ({ scene }) => {
  const [selectedWord, setSelectedWord] = useState(null);

  const handleWordClick = (keyword) => {
    setSelectedWord(selectedWord?.word === keyword.word ? null : keyword);
  };

  const words = scene.transcript.split(' ');

  const findKeyword = (word) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
    return scene.keywords.find(k => k.word.toLowerCase() === cleanWord);
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📖 Reading Practice
        </h3>
        <p className="text-gray-600">
          Click on highlighted words to see their meanings and translations
        </p>
      </div>

      {/* Interactive Transcript */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">English:</p>
          <div className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
            {words.map((word, index) => {
              const keyword = findKeyword(word);
              const isKeyword = keyword !== undefined;

              return (
                <span key={index}>
                  <span
                    onClick={() => isKeyword && handleWordClick(keyword)}
                    className={`
                      ${isKeyword
                        ? 'text-primary-600 font-bold cursor-pointer hover:text-primary-700 hover:underline transition-colors'
                        : ''
                      }
                      ${selectedWord?.word === keyword?.word ? 'bg-primary-200 px-1 rounded' : ''}
                    `}
                  >
                    {word}
                  </span>
                  {index < words.length - 1 && ' '}
                </span>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-2">Thai:</p>
          <p className="text-xl text-gray-700 text-center italic">
            {scene.thaiTranslation}
          </p>
        </div>
      </div>

      {/* Word Definition Popup */}
      {selectedWord && (
        <div className="bg-white border-2 border-primary-400 rounded-lg p-6 mb-6 animate-fade-in shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-2xl font-bold text-primary-700 mb-1">
                {selectedWord.word}
              </h4>
              <p className="text-lg text-gray-600 italic">
                {selectedWord.translation}
              </p>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Definition:</p>
            <p className="text-gray-800">{selectedWord.definition}</p>
          </div>
        </div>
      )}

      {/* Vocabulary List */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📚</span>
          <span>Key Vocabulary</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scene.keywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(keyword)}
              className={`
                text-left p-4 rounded-lg transition-all duration-200
                ${selectedWord?.word === keyword.word
                  ? 'bg-primary-100 border-2 border-primary-400'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }
              `}
            >
              <p className="font-bold text-primary-700 mb-1">{keyword.word}</p>
              <p className="text-sm text-gray-600">{keyword.translation}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 p-4 rounded-lg mt-6">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Reading Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on any blue word to see its meaning</li>
          <li>• Read the sentence multiple times for better comprehension</li>
          <li>• Try to understand the context before checking translations</li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingMode;
