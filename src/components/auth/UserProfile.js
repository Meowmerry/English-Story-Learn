import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import XPDisplay from '../XPDisplay';

const UserProfile = ({ onLogout }) => {
  const { user, syncing, syncProgress } = useAuth();

  if (!user) return null;

  const handleSync = async () => {
    const result = await syncProgress();
    if (result.success) {
      alert('Progress synced successfully!');
    } else {
      alert('Failed to sync progress: ' + result.error);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border-2 border-primary-200">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
          {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">
            {user.displayName || 'User'}
          </h3>
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
        </div>
      </div>

      {/* XP Display */}
      <div className="mb-4">
        <XPDisplay showDetailed={true} />
      </div>

      {/* Sync Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm">
          <span className={syncing ? 'text-blue-600' : 'text-green-600'}>
            {syncing ? '🔄' : '✅'}
          </span>
          <span className="text-gray-700">
            {syncing ? 'Syncing...' : 'Synced to cloud'}
          </span>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="text-xs text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50"
        >
          Sync Now
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-2 px-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
