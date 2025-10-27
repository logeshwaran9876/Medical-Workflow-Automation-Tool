import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { FaClinicMedical, FaNotesMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DoctorNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const doctorDetails = JSON.parse(localStorage.getItem('user')) || {
    name: "Doctor",
    email: "",
    specialization: "General Medicine",
    phone: "",
    schedule: "Mon-Fri, 9am-5pm",
    status: "active",
    avatar: "",
    role: "doctor"
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-teal-600 text-white shadow-lg z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaClinicMedical className="text-2xl mr-2" />
            <span className="text-xl font-bold">MediCare</span>
          </div>
          
          <div className="hidden md:flex items-center ml-6 bg-teal-500/30 rounded-full px-4 py-1 backdrop-blur-sm">
            <FiSearch className="mr-2 text-teal-200" />
            <input 
              type="text" 
              placeholder="Search patients, records..." 
              className="bg-transparent border-0 focus:ring-0 text-white placeholder-teal-200 w-64 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="p-2 relative rounded-full hover:bg-teal-700/50 transition-colors">
            <div className="relative">
              <FiBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full ring-2 ring-teal-600"></span>
            </div>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center ring-2 ring-teal-400 group-hover:ring-teal-300 transition-all">
                {doctorDetails.avatar ? (
                  <img 
                    src={doctorDetails.avatar} 
                    alt="Doctor Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-white" />
                )}
              </div>
              <div className="flex items-center">
                <span className="font-medium hidden md:inline-block text-sm">Dr. {doctorDetails.name}</span>
                <FiChevronDown className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </button>
            
            <div className={`absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50">
                <p className="text-sm font-semibold text-gray-800">Dr. {doctorDetails.name}</p>
                <p className="text-xs text-gray-500 truncate">{doctorDetails.email || 'No email provided'}</p>
              </div>
              
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-start">
                  <div className="bg-teal-100/50 rounded-lg p-2 mr-3">
                    <FiUser className="text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</h4>
                    <p className="text-sm text-gray-800">{doctorDetails.specialization || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100/50 rounded-lg p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</h4>
                    <p className="text-sm text-gray-800">{doctorDetails.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100/50 rounded-lg p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</h4>
                    <p className="text-sm text-gray-800">{doctorDetails.schedule || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100/50 rounded-lg p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</h4>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-800 capitalize mr-2">{doctorDetails.status || 'active'}</span>
                      <span className={`h-2 w-2 rounded-full ${doctorDetails.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/doctor/settings');
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiSettings className="mr-3 text-gray-500" />
                  Account Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-3 text-red-500" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/doctor/quick-note')}
            className="flex items-center space-x-1 bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <FaNotesMedical />
            <span>Quick Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}