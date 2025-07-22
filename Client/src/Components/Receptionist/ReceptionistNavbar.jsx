import { useState, useRef, useEffect } from 'react';
import { 
  FiSearch, FiBell, FiUser, FiLogOut, 
  FiSettings, FiChevronDown, FiMenu 
} from 'react-icons/fi';
import { 
  FaClinicMedical, FaRegCalendarAlt, 
  FaUserFriends, FaProcedures 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ReceptionistNavbar({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [receptionistDetails, setReceptionistDetails] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Safely parse user data from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setReceptionistDetails(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Failed to load user data');
    }
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewPatient = () => {
    navigate('/receptionist/patients');
  };

  const handleNewAppointment = () => {
    navigate('/receptionist/appointments');
  };

  const handleLogout = () => {
    // Clear all relevant user data from storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg z-30"
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/dashboard')}
            role="button"
            tabIndex={0}
          >
            <FaClinicMedical className="text-2xl mr-2 text-amber-300" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
              MediCare+
            </span>
          </motion.div>
          
          {/* Search bar */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="hidden md:flex items-center ml-6 bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm"
          >
            <FiSearch className="mr-2 text-indigo-200" />
            <input 
              type="text" 
              placeholder="Search patients, appointments..." 
              className="bg-transparent border-0 focus:ring-0 text-white placeholder-indigo-200 w-64 focus:outline-none"
              aria-label="Search"
            />
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Quick actions */}
          <div className="hidden sm:flex space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewPatient}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
              aria-label="Add new patient"
            >
              <FaUserFriends className="text-indigo-100" />
              <span>New Patient</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewAppointment}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
              aria-label="Create new appointment"
            >
              <FaRegCalendarAlt />
              <span>New Appointment</span>
            </motion.button>
          </div>
          
          {/* Notifications */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 relative rounded-full hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <div className="relative">
              <FiBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full ring-2 ring-indigo-600"></span>
            </div>
          </motion.button>
          
          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDropdown}
              className="flex items-center space-x-2 group cursor-pointer focus:outline-none"
              aria-label="User profile"
              aria-expanded={isDropdownOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-white/80 group-hover:ring-white transition-all">
                {receptionistDetails?.avatar ? (
                  <img 
                    src={receptionistDetails.avatar} 
                    alt="User avatar" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <FiUser className="text-white" />
                )}
              </div>
              <div className="hidden md:flex items-center">
                <span className="font-medium text-sm">
                  {receptionistDetails?.name || 'User'}
                </span>
                <FiChevronDown className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </motion.button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200"
                >
                  {receptionistDetails ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <p className="text-sm font-semibold text-gray-800">{receptionistDetails.name}</p>
                        <p className="text-xs text-gray-500 truncate">{receptionistDetails.email}</p>
                      </div>
                      
                      <div className="px-4 py-3 space-y-3">
                        <div className="flex items-start">
                          <div className="bg-indigo-100/50 rounded-lg p-2 mr-3">
                            <FaProcedures className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</h4>
                            <p className="text-sm text-gray-800">
                              {receptionistDetails.department || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-amber-100/50 rounded-lg p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</h4>
                            <p className="text-sm text-gray-800">
                              {receptionistDetails.shift || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <p className="text-sm font-semibold text-gray-800">User Profile</p>
                      <p className="text-xs text-gray-500">Loading user data...</p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 bg-gray-50">
                    <button 
                      onClick={() => navigate('/settings')}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiSettings className="mr-3 text-gray-500" />
                      Account Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiLogOut className="mr-3 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}