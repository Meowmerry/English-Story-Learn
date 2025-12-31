import React, { useState, useEffect } from 'react';
import { getXPStats } from '../utils/xpSystem';

const XPDisplay = ({ showDetailed = false }) => {
  const [stats, setStats] = useState({
    currentXP: 0,
    level: 1,
    xpForNextLevel: 100,
    progress: 0
  });

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const newStats = getXPStats();
    setStats(newStats);
  };

  // Listen for XP changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'storyflow_user_xp') {
        updateStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-window updates
    const handleXPUpdate = () => {
      updateStats();
    };
    window.addEventListener('xpUpdate', handleXPUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('xpUpdate', handleXPUpdate);
    };
  }, []);

  if (!showDetailed) {
    return (
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-md px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-xs text-gray-500">Level</p>
            <p className="font-bold text-primary-700">{stats.level}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-300"></div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✨</span>
          <div>
            <p className="text-xs text-gray-500">XP</p>
            <p className="font-bold text-secondary-600">{stats.currentXP.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {stats.level}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Level {stats.level}</h3>
            <p className="text-sm text-gray-600">{stats.currentXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Next Level</p>
          <p className="text-sm font-semibold text-primary-700">
            {stats.xpForNextLevel.toLocaleString()} XP
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(stats.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.progress}%` }}
          ></div>
        </div>
      </div>

      {/* XP Guide */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Earn XP:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>✅ Correct Answer</span>
            <span className="font-semibold text-green-600">+100 XP</span>
          </div>
          <div className="flex justify-between">
            <span>❌ Incorrect Answer</span>
            <span className="font-semibold text-red-600">-50 XP</span>
          </div>
          <div className="flex justify-between">
            <span>🎬 Complete Scene</span>
            <span className="font-semibold text-blue-600">+50 XP</span>
          </div>
          <div className="flex justify-between">
            <span>🏆 Complete Story</span>
            <span className="font-semibold text-purple-600">+500 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPDisplay;
