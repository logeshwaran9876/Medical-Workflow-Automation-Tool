import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  error = false,
  icon,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={twMerge(
          'block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none',
          error 
            ? 'border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500',
          className,
          !icon && 'pl-3'
        )}
        {...props}
      />
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  icon: PropTypes.element,
};

Input.displayName = 'Input';

export default Input;