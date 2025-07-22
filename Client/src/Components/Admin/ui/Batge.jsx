import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const colorClasses = {
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const Badge = ({ 
  color = 'gray',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const combinedClasses = twMerge(
    baseClasses,
    colorClasses[color] || colorClasses.gray,
    sizeClasses[size] || sizeClasses.md,
    className
  );

  return (
    <span className={combinedClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  color: PropTypes.oneOf([
    'gray', 'red', 'orange', 'yellow', 
    'green', 'blue', 'indigo', 'purple', 'pink'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;