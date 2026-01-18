import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import XPDisplay from './XPDisplay';
import UserProfile from './auth/UserProfile';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ stories, onStorySelect, isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'stories', label: 'All Stories', icon: '📚', path: '/stories' },
    { id: 'stats', label: 'My Progress', icon: '📊', path: '/progress' },
    { id: 'resources', label: 'Resources', icon: '🛠️', path: '/resources' },
    { id: 'about', label: 'About Me', icon: '👤', path: '/about' }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-80 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary-700">StoryFlow</h2>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">English Learning Platform</p>

          {/* Authentication Section */}
          {user ? (
            <div className="space-y-3">
              <UserProfile onLogout={logout} />
              <XPDisplay showDetailed={false} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg border border-primary-200">
                <p className="text-xs text-gray-600 mb-3 text-center">
                  Sign in to save your progress and sync across devices!
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full bg-white hover:bg-gray-50 text-primary-600 font-semibold py-2 px-4 rounded-lg border-2 border-primary-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <XPDisplay showDetailed={false} />
              <div className="text-xs text-gray-500 text-center">
                <p>Playing as guest - scores saved locally</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActivePath(item.path)
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            {/* Admin Only - Upload Stories Button */}
            {isAdmin && (
              <Link
                to="/admin/upload"
                onClick={onClose}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActivePath('/admin/upload')
                    ? 'bg-red-100 text-red-700 font-semibold'
                    : 'text-red-600 hover:bg-red-50 border border-red-200'
                  }
                `}
              >
                <span className="text-xl">⬆️</span>
                <span>Upload Stories</span>
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Admin</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Story List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="font-semibold text-gray-700 mb-3">Quick Access</h3>
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => onStorySelect(story)}
              className={`
                card cursor-pointer transition-all duration-200
                ${location.pathname === `/story/${story.id}`
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:bg-gray-50'
                }
              `}
            >
              {/* Story Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-primary-200 to-secondary-200 rounded-lg mb-4 overflow-hidden relative">
                {story.thumbnail ?
                  (
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🎬
                    </div>
                  )
                }
              </div>
              {/* Story Info */}
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {story.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full font-semibold ${getDifficultyColor(story.difficulty)}`}>
                  {story.difficulty}
                </span>
                <span className="text-gray-500">
                  {story.totalScenes} scenes
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-semibold mb-1">StoryFlow</p>
            <p>Learn English Naturally</p>
          </div>
        </div>
      </aside>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Sidebar;
