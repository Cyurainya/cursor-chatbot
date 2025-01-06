import React from 'react';

interface NavbarProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleDarkMode, isDarkMode }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* macOS style window controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              AI Chat
            </span>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <button
              onClick={onToggleDarkMode}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors duration-300 border border-gray-200 dark:border-gray-700"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 transition-transform duration-300 shadow-sm border border-gray-200 dark:border-gray-600`}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;