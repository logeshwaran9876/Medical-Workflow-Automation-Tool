import { useState, useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiAdminFill } from "react-icons/ri";
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { toggleDarkMode, darkMode } = useTheme();
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {
    name: 'Guest',
    email: '',
    avatar: null,
    role:''
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login
    navigate('/login');
    
    // Close dropdown
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {userData.avatar ? (
          <img 
            className="h-8 w-8 rounded-full" 
            src={userData.avatar} 
            alt={userData.name} 
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <FiUser className="text-indigo-600 dark:text-indigo-300" />
          </div>
        )}
        <span className="hidden md:inline text-gray-700 dark:text-gray-200">
          {userData.name}
        </span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userData.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData.email || 'No email provided'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData.role || 'No role provided'}
              </p>
            </div>
            <RiAdminFill />

            <button
              onClick={toggleDarkMode}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <>
                  <FiSun className="mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <FiMoon className="mr-3" />
                  Dark Mode
                </>
              )}
            </button>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FiSettings className="mr-3" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <FiLogOut className="mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;