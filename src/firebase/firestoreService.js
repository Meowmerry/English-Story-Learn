import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, query, where, orderBy, addDoc, limit } from 'firebase/firestore';
import { db } from './config';

// Save user progress to Firestore
export const saveUserProgress = async (userId, progressData) => {
  if (!userId) {
    console.warn('No user ID provided for saving progress');
    return { success: false, error: 'No user ID' };
  }

  try {
    const progressRef = doc(db, 'userProgress', userId);
    await setDoc(progressRef, {
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, error: error.message };
  }
};

// Get user progress from Firestore
export const getUserProgress = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for getting progress');
    return { data: null, error: 'No user ID' };
  }

  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return { data: progressSnap.data(), error: null };
    } else {
      // Initialize progress if it doesn't exist
      const initialProgress = {
        xp: 0,
        level: 1,
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        listening: { total: 0, correct: 0, incorrect: 0 },
        speaking: { total: 0, excellent: 0, good: 0, needsWork: 0 },
        writing: { total: 0, perfect: 0, good: 0, needsWork: 0 },
        scenesCompleted: 0,
        storiesCompleted: 0,
        streakDays: 0,
        lastPlayedDate: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(progressRef, initialProgress);
      return { data: initialProgress, error: null };
    }
  } catch (error) {
    console.error('Error getting progress:', error);
    return { data: null, error: error.message };
  }
};

// Update XP
export const updateUserXP = async (userId, xpChange) => {
  if (!userId) return { success: false };

  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const newXP = Math.max(0, (currentData.xp || 0) + xpChange);
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

      await updateDoc(progressRef, {
        xp: newXP,
        level: newLevel,
        updatedAt: serverTimestamp()
      });

      return { success: true, newXP, newLevel };
    }

    return { success: false };
  } catch (error) {
    console.error('Error updating XP:', error);
    return { success: false, error: error.message };
  }
};

// Update listening stats
export const updateListeningStatsFirestore = async (userId, isCorrect) => {
  if (!userId) return { success: false };

  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const listening = currentData.listening || { total: 0, correct: 0, incorrect: 0 };

      await updateDoc(progressRef, {
        totalQuestions: (currentData.totalQuestions || 0) + 1,
        correctAnswers: (currentData.correctAnswers || 0) + (isCorrect ? 1 : 0),
        incorrectAnswers: (currentData.incorrectAnswers || 0) + (isCorrect ? 0 : 1),
        listening: {
          total: listening.total + 1,
          correct: listening.correct + (isCorrect ? 1 : 0),
          incorrect: listening.incorrect + (isCorrect ? 0 : 1)
        },
        updatedAt: serverTimestamp()
      });

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Error updating listening stats:', error);
    return { success: false, error: error.message };
  }
};

// Update speaking stats
export const updateSpeakingStatsFirestore = async (userId, score) => {
  if (!userId) return { success: false };

  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const speaking = currentData.speaking || { total: 0, excellent: 0, good: 0, needsWork: 0 };

      const excellent = score >= 85 ? 1 : 0;
      const good = score >= 70 && score < 85 ? 1 : 0;
      const needsWork = score < 70 ? 1 : 0;

      await updateDoc(progressRef, {
        totalQuestions: (currentData.totalQuestions || 0) + 1,
        correctAnswers: (currentData.correctAnswers || 0) + (score >= 70 ? 1 : 0),
        incorrectAnswers: (currentData.incorrectAnswers || 0) + (score < 70 ? 1 : 0),
        speaking: {
          total: speaking.total + 1,
          excellent: speaking.excellent + excellent,
          good: speaking.good + good,
          needsWork: speaking.needsWork + needsWork
        },
        updatedAt: serverTimestamp()
      });

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Error updating speaking stats:', error);
    return { success: false, error: error.message };
  }
};

// Update writing stats
export const updateWritingStatsFirestore = async (userId, score) => {
  if (!userId) return { success: false };

  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const currentData = progressSnap.data();
      const writing = currentData.writing || { total: 0, perfect: 0, good: 0, needsWork: 0 };

      const perfect = score >= 90 ? 1 : 0;
      const good = score >= 75 && score < 90 ? 1 : 0;
      const needsWork = score < 75 ? 1 : 0;

      await updateDoc(progressRef, {
        totalQuestions: (currentData.totalQuestions || 0) + 1,
        correctAnswers: (currentData.correctAnswers || 0) + (score >= 75 ? 1 : 0),
        incorrectAnswers: (currentData.incorrectAnswers || 0) + (score < 75 ? 1 : 0),
        writing: {
          total: writing.total + 1,
          perfect: writing.perfect + perfect,
          good: writing.good + good,
          needsWork: writing.needsWork + needsWork
        },
        updatedAt: serverTimestamp()
      });

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Error updating writing stats:', error);
    return { success: false, error: error.message };
  }
};

// Sync local storage data to Firestore (for migration)
export const syncLocalToFirestore = async (userId) => {
  if (!userId) return { success: false };

  try {
    // Get local storage data
    const localXP = localStorage.getItem('storyflow_user_xp');
    const localStats = localStorage.getItem('storyflow_user_stats');

    if (localXP || localStats) {
      const xp = localXP ? parseInt(localXP, 10) : 0;
      const stats = localStats ? JSON.parse(localStats) : {};
      const level = Math.floor(Math.sqrt(xp / 100)) + 1;

      await saveUserProgress(userId, {
        xp,
        level,
        ...stats
      });

      return { success: true, synced: true };
    }

    return { success: true, synced: false };
  } catch (error) {
    console.error('Error syncing local data:', error);
    return { success: false, error: error.message };
  }
};

// ============ STORY FUNCTIONS ============

// Get all published stories from Firestore
export const getAllStories = async () => {
  try {
    const storiesRef = collection(db, 'stories');
    const q = query(storiesRef, where('published', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const stories = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });

    return { data: stories, error: null };
  } catch (error) {
    console.error('Error getting stories:', error);
    return { data: null, error: error.message };
  }
};

// Get a single story by ID
export const getStoryById = async (storyId) => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (storySnap.exists()) {
      return { data: { id: storySnap.id, ...storySnap.data() }, error: null };
    } else {
      return { data: null, error: 'Story not found' };
    }
  } catch (error) {
    console.error('Error getting story:', error);
    return { data: null, error: error.message };
  }
};

// Get stories by difficulty level
export const getStoriesByDifficulty = async (difficulty) => {
  try {
    const storiesRef = collection(db, 'stories');
    const q = query(
      storiesRef,
      where('published', '==', true),
      where('difficulty', '==', difficulty),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const stories = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });

    return { data: stories, error: null };
  } catch (error) {
    console.error('Error getting stories by difficulty:', error);
    return { data: null, error: error.message };
  }
};

// ============ CHAT FUNCTIONS ============

// Save a chat message to Firestore
export const saveChatMessage = async (userId, message) => {
  if (!userId) {
    console.warn('No user ID provided for saving chat message');
    return { success: false, error: 'No user ID' };
  }

  try {
    const chatRef = collection(db, 'userChats', userId, 'messages');
    await addDoc(chatRef, {
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp()
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return { success: false, error: error.message };
  }
};

// Get chat history from Firestore
export const getChatHistory = async (userId, limitCount = 50) => {
  if (!userId) {
    console.warn('No user ID provided for getting chat history');
    return [];
  }

  try {
    const chatRef = collection(db, 'userChats', userId, 'messages');
    const q = query(chatRef, orderBy('timestamp', 'asc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        role: data.role,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });

    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};
