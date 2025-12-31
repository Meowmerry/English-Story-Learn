// Stats System Utility
const STATS_STORAGE_KEY = 'storyflow_user_stats';

// Default stats structure
const DEFAULT_STATS = {
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  listening: {
    total: 0,
    correct: 0,
    incorrect: 0
  },
  speaking: {
    total: 0,
    excellent: 0, // 85%+
    good: 0, // 70-84%
    needsWork: 0 // <70%
  },
  writing: {
    total: 0,
    perfect: 0, // 90%+
    good: 0, // 75-89%
    needsWork: 0 // <75%
  },
  scenesCompleted: 0,
  storiesCompleted: 0,
  streakDays: 0,
  lastPlayedDate: null
};

// Get current stats
export const getStats = () => {
  const stats = localStorage.getItem(STATS_STORAGE_KEY);
  return stats ? JSON.parse(stats) : DEFAULT_STATS;
};

// Save stats
const saveStats = (stats) => {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  // Trigger custom event for stats update
  window.dispatchEvent(new Event('statsUpdate'));
};

// Update listening stats
export const updateListeningStats = (isCorrect) => {
  const stats = getStats();
  stats.totalQuestions++;
  stats.listening.total++;

  if (isCorrect) {
    stats.correctAnswers++;
    stats.listening.correct++;
  } else {
    stats.incorrectAnswers++;
    stats.listening.incorrect++;
  }

  saveStats(stats);
  return stats;
};

// Update speaking stats
export const updateSpeakingStats = (score) => {
  const stats = getStats();
  stats.totalQuestions++;
  stats.speaking.total++;

  if (score >= 85) {
    stats.speaking.excellent++;
    stats.correctAnswers++;
  } else if (score >= 70) {
    stats.speaking.good++;
    stats.correctAnswers++;
  } else {
    stats.speaking.needsWork++;
    stats.incorrectAnswers++;
  }

  saveStats(stats);
  return stats;
};

// Update writing stats
export const updateWritingStats = (score) => {
  const stats = getStats();
  stats.totalQuestions++;
  stats.writing.total++;

  if (score >= 90) {
    stats.writing.perfect++;
    stats.correctAnswers++;
  } else if (score >= 75) {
    stats.writing.good++;
    stats.correctAnswers++;
  } else {
    stats.writing.needsWork++;
    stats.incorrectAnswers++;
  }

  saveStats(stats);
  return stats;
};

// Mark scene as completed
export const completeScene = () => {
  const stats = getStats();
  stats.scenesCompleted++;
  saveStats(stats);
  return stats;
};

// Mark story as completed
export const completeStory = () => {
  const stats = getStats();
  stats.storiesCompleted++;
  saveStats(stats);
  return stats;
};

// Update streak
export const updateStreak = () => {
  const stats = getStats();
  const today = new Date().toDateString();
  const lastPlayed = stats.lastPlayedDate;

  if (!lastPlayed) {
    // First time playing
    stats.streakDays = 1;
  } else {
    const lastDate = new Date(lastPlayed);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Consecutive day
      stats.streakDays++;
    } else {
      // Streak broken
      stats.streakDays = 1;
    }
  }

  stats.lastPlayedDate = today;
  saveStats(stats);
  return stats;
};

// Calculate accuracy percentage
export const getAccuracy = () => {
  const stats = getStats();
  if (stats.totalQuestions === 0) return 0;
  return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
};

// Calculate mode-specific accuracy
export const getListeningAccuracy = () => {
  const stats = getStats();
  if (stats.listening.total === 0) return 0;
  return Math.round((stats.listening.correct / stats.listening.total) * 100);
};

export const getSpeakingAccuracy = () => {
  const stats = getStats();
  if (stats.speaking.total === 0) return 0;
  const goodAttempts = stats.speaking.excellent + stats.speaking.good;
  return Math.round((goodAttempts / stats.speaking.total) * 100);
};

export const getWritingAccuracy = () => {
  const stats = getStats();
  if (stats.writing.total === 0) return 0;
  const goodAttempts = stats.writing.perfect + stats.writing.good;
  return Math.round((goodAttempts / stats.writing.total) * 100);
};

// Get comprehensive stats summary
export const getStatsSummary = () => {
  const stats = getStats();
  return {
    ...stats,
    overallAccuracy: getAccuracy(),
    listeningAccuracy: getListeningAccuracy(),
    speakingAccuracy: getSpeakingAccuracy(),
    writingAccuracy: getWritingAccuracy()
  };
};

// Reset all stats
export const resetStats = () => {
  localStorage.removeItem(STATS_STORAGE_KEY);
  return DEFAULT_STATS;
};
