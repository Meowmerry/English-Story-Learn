import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Create user profile in Firestore
const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        email,
        displayName: displayName || email.split('@')[0],
        createdAt,
        lastLogin: createdAt,
        ...additionalData
      });

      // Initialize user progress
      const progressRef = doc(db, 'userProgress', user.uid);
      await setDoc(progressRef, {
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
        createdAt,
        updatedAt: createdAt
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  return userRef;
};

// Register with email and password
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Create user profile in Firestore
    await createUserProfile(user, { displayName });

    return { user, error: null };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null, error: error.message };
  }
};

// Login with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // Update last login
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

    return { user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: error.message };
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create or update user profile
    await createUserProfile(user);

    return { user, error: null };
  } catch (error) {
    console.error('Google login error:', error);
    return { user: null, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error.message };
  }
};

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
