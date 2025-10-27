import { FiSun, FiMoon, FiBell, FiSearch } from 'react-icons/fi';
import { useTheme } from './context/ThemeContext';
import UserDropdown from './ui/UserDropdown';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <FiSearch className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
          </button>
          
          <button 
            className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Notifications"
          >
            <FiBell className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {user ? (
            <UserDropdown />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Not logged in
            </div>
          )}
        </div>
      </div>
    </header>
  );
}