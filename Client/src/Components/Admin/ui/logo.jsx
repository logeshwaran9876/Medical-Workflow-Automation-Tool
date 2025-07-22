// src/components/ui/Logo.jsx
import React from 'react';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
        {/* Brain icon with cross */}
        <path 
          fill="currentColor" 
          d="M12 2a10 10 0 0 0-7.35 16.76 1 1 0 0 0 1.41-1.41A8 8 0 1 1 20 12a7.93 7.93 0 0 1-1.69 4.9 1 1 0 0 0 1.57 1.23A9.93 9.93 0 0 0 22 12 10 10 0 0 0 12 2zm-1 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1zm1 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
        />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-gray-800 dark:text-white">MedFlow</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">Admin</span>
    </div>
  </div>
);

export default Logo;  // Default export