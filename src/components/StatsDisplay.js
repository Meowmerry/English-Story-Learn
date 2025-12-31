import React, { useState, useEffect } from 'react';
import { getStatsSummary } from '../utils/statsSystem';
import { getXPStats } from '../utils/xpSystem';

const StatsDisplay = () => {
  const [stats, setStats] = useState(null);
  const [xpStats, setXpStats] = useState(null);

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const newStats = getStatsSummary();
    const newXpStats = getXPStats();
    setStats(newStats);
    setXpStats(newXpStats);
  };

  // Listen for stats and XP changes
  useEffect(() => {
    const handleStatsUpdate = () => {
      updateStats();
    };

    window.addEventListener('statsUpdate', handleStatsUpdate);
    window.addEventListener('xpUpdate', handleStatsUpdate);

    return () => {
      window.removeEventListener('statsUpdate', handleStatsUpdate);
      window.removeEventListener('xpUpdate', handleStatsUpdate);
    };
  }, []);

  if (!stats || !xpStats) {
    return <div className="text-center py-8">Loading stats...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">Your Progress</h1>
        <p className="text-lg text-gray-600">
          Track your learning journey and celebrate your achievements!
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-sm opacity-90">Level</p>
          <p className="text-3xl font-bold">{xpStats.level}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-sm opacity-90">Total XP</p>
          <p className="text-3xl font-bold">{xpStats.currentXP.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm opacity-90">Accuracy</p>
          <p className="text-3xl font-bold">{stats.overallAccuracy}%</p>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-3xl mb-2">🔥</div>
          <p className="text-sm opacity-90">Streak</p>
          <p className="text-3xl font-bold">{stats.streakDays} days</p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-4xl font-bold text-primary-600">{stats.totalQuestions}</p>
            <p className="text-sm text-gray-600 mt-2">Total Questions</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-4xl font-bold text-green-600">{stats.correctAnswers}</p>
            <p className="text-sm text-gray-600 mt-2">Correct Answers</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-4xl font-bold text-red-600">{stats.incorrectAnswers}</p>
            <p className="text-sm text-gray-600 mt-2">Incorrect Answers</p>
          </div>
        </div>
      </div>

      {/* Mode-Specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Listening Stats */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">👂</div>
            <h3 className="text-xl font-bold text-gray-800">Listening</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Attempts</span>
              <span className="font-bold text-gray-800">{stats.listening.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Correct</span>
              <span className="font-bold text-green-600">{stats.listening.correct}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Incorrect</span>
              <span className="font-bold text-red-600">{stats.listening.incorrect}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Accuracy</span>
                <span className="text-2xl font-bold text-primary-600">{stats.listeningAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.listeningAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Speaking Stats */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🗣️</div>
            <h3 className="text-xl font-bold text-gray-800">Speaking</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Attempts</span>
              <span className="font-bold text-gray-800">{stats.speaking.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Excellent (85%+)</span>
              <span className="font-bold text-green-600">{stats.speaking.excellent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Good (70-84%)</span>
              <span className="font-bold text-yellow-600">{stats.speaking.good}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Needs Work</span>
              <span className="font-bold text-red-600">{stats.speaking.needsWork}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Accuracy</span>
                <span className="text-2xl font-bold text-primary-600">{stats.speakingAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.speakingAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Stats */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">✍️</div>
            <h3 className="text-xl font-bold text-gray-800">Writing</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Attempts</span>
              <span className="font-bold text-gray-800">{stats.writing.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Perfect (90%+)</span>
              <span className="font-bold text-green-600">{stats.writing.perfect}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Good (75-89%)</span>
              <span className="font-bold text-yellow-600">{stats.writing.good}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Needs Work</span>
              <span className="font-bold text-red-600">{stats.writing.needsWork}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Accuracy</span>
                <span className="text-2xl font-bold text-primary-600">{stats.writingAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.writingAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-2xl font-bold text-gray-800">{stats.scenesCompleted}</p>
            <p className="text-sm text-gray-600">Scenes Completed</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-2xl font-bold text-gray-800">{stats.storiesCompleted}</p>
            <p className="text-sm text-gray-600">Stories Completed</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-2xl font-bold text-gray-800">{stats.correctAnswers}</p>
            <p className="text-sm text-gray-600">Correct Answers</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-2xl font-bold text-gray-800">{xpStats.currentXP}</p>
            <p className="text-sm text-gray-600">Total XP Earned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
