import { forwardRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const Input = forwardRef(({ label, icon, error, className = '', ...props }, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-md shadow-sm ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
          } focus:border-transparent`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;