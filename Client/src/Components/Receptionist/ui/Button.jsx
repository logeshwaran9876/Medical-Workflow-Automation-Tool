

import React from 'react';
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const variantStyles = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
export default Button;