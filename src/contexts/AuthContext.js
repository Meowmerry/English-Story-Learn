import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthChange,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  getUserRole
} from '../firebase/authService';
import { getUserProgress, saveUserProgress, syncLocalToFirestore } from '../firebase/firestoreService';
import { getStats, resetStats } from '../utils/statsSystem';
import { getCurrentXP, resetXP } from '../utils/xpSystem';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user role from Firestore
        const role = await getUserRole(firebaseUser.uid);
        setUserRole(role);

        // Sync local data to Firebase when user logs in
        setSyncing(true);
        try {
          await syncLocalToFirestore(firebaseUser.uid);

          // Load user progress from Firebase
          const { data } = await getUserProgress(firebaseUser.uid);
          if (data) {
            // Optionally update local storage with cloud data
            console.log('User progress loaded from Firebase:', data);
          }
        } catch (error) {
          console.error('Error syncing data:', error);
        } finally {
          setSyncing(false);
        }
      } else {
        setUser(null);
        setUserRole('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const { user, error } = await loginWithEmail(email, password);
      if (error) {
        return { success: false, error };
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const { user, error } = await registerWithEmail(email, password, displayName);
      if (error) {
        return { success: false, error };
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginGoogle = async () => {
    try {
      const { user, error } = await loginWithGoogle();
      if (error) {
        return { success: false, error };
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear local storage (XP and stats) when logging out
      resetXP();
      resetStats();

      // Dispatch event to update UI components
      window.dispatchEvent(new Event('xpUpdate'));

      // Logout from Firebase
      await firebaseLogout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const syncProgress = async () => {
    if (!user) return { success: false, error: 'No user logged in' };

    setSyncing(true);
    try {
      const stats = getStats();
      const xp = getCurrentXP();
      const level = Math.floor(Math.sqrt(xp / 100)) + 1;

      await saveUserProgress(user.uid, {
        xp,
        level,
        ...stats
      });

      return { success: true };
    } catch (error) {
      console.error('Error syncing progress:', error);
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    syncing,
    login,
    register,
    loginGoogle,
    logout,
    syncProgress,
    isAuthenticated: !!user,
    isAdmin: userRole === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
