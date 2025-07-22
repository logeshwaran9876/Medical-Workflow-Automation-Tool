import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { FiLoader } from 'react-icons/fi';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClasses = twMerge(
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    className
  );

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <FiLoader className={`animate-spin ${iconPosition === 'right' ? 'order-1 ml-2' : 'mr-2'}`} />
      )}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
});

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
};

Button.displayName = 'Button';

export default Button;