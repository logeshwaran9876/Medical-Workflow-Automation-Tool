

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi"; // FiSearch added for SearchBar
export const CustomModal = ({ isOpen, onClose, children, title, size = 'md', overlayClassName = '', className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[size];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm ${overlayClassName}`}
        onClick={onClose}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className={`bg-white rounded-xl shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto ${className}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close modal">
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export const CustomInput = ({ label, name, type = 'text', value, onChange, icon, error, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
        } focus:border-transparent`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
export const CustomSelect = ({ label, name, value, onChange, options, icon, error, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
        } focus:border-transparent`}
        {...props}
      >
        {options.length === 0 && <option value="" disabled>Loading data...</option>}
        {options.length > 0 && !value && <option value="" disabled>Select an option</option>}
        
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
export const CustomButton = ({ children, variant = 'primary', loading = false, onClick, type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
        variants[variant]
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
};
export const CustomLoadingSpinner = ({ fullPage = false }) => (
  <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : ''}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
  </div>
);
export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative flex-grow">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
