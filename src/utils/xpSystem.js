// XP System Utility
const XP_STORAGE_KEY = 'storyflow_user_xp';
const XP_HISTORY_KEY = 'storyflow_xp_history';

export const XP_VALUES = {
  CORRECT_ANSWER: 100,
  INCORRECT_ANSWER: -50,
  COMPLETE_SCENE: 50,
  COMPLETE_STORY: 500
};

// Get current XP
export const getCurrentXP = () => {
  const xp = localStorage.getItem(XP_STORAGE_KEY);
  return xp ? parseInt(xp, 10) : 0;
};

// Set XP
export const setXP = (xp) => {
  const newXP = Math.max(0, xp); // XP cannot go below 0
  localStorage.setItem(XP_STORAGE_KEY, newXP.toString());
  return newXP;
};

// Add XP
export const addXP = (amount, reason = '') => {
  const currentXP = getCurrentXP();
  const newXP = setXP(currentXP + amount);

  // Log to history
  addXPHistory({
    amount,
    reason,
    newTotal: newXP,
    timestamp: new Date().toISOString()
  });

  return {
    previousXP: currentXP,
    newXP,
    change: amount
  };
};

// Subtract XP
export const subtractXP = (amount, reason = '') => {
  return addXP(-amount, reason);
};

// Add entry to XP history
const addXPHistory = (entry) => {
  const history = getXPHistory();
  history.unshift(entry); // Add to beginning

  // Keep only last 100 entries
  if (history.length > 100) {
    history.pop();
  }

  localStorage.setItem(XP_HISTORY_KEY, JSON.stringify(history));
};

// Get XP history
export const getXPHistory = () => {
  const history = localStorage.getItem(XP_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

// Calculate level based on XP
export const calculateLevel = (xp) => {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Calculate XP needed for next level
export const getXPForNextLevel = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  const nextLevel = currentLevel + 1;
  const xpNeeded = Math.pow(nextLevel - 1, 2) * 100;
  return xpNeeded - currentXP;
};

// Get progress to next level as percentage
export const getLevelProgress = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(100, Math.max(0, progress));
};

// Reset XP (useful for testing or user reset)
export const resetXP = () => {
  localStorage.removeItem(XP_STORAGE_KEY);
  localStorage.removeItem(XP_HISTORY_KEY);
  return 0;
};

// Get stats
export const getXPStats = () => {
  const currentXP = getCurrentXP();
  const level = calculateLevel(currentXP);
  const xpForNextLevel = getXPForNextLevel(currentXP);
  const progress = getLevelProgress(currentXP);

  return {
    currentXP,
    level,
    xpForNextLevel,
    progress
  };
};
