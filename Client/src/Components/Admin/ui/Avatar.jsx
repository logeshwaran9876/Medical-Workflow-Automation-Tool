import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ src, alt, text, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };
  const bgColor = 'bg-gray-300';
  const textColor = 'text-gray-600';

  return (
    <div
      className={`rounded-full flex items-center justify-center overflow-hidden ${bgColor} ${textColor} ${
        sizeClasses[size]
      } ${className}`}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : text ? (
        <span className="font-medium">{text}</span>
      ) : (
        <svg
          className="w-1/2 h-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
};

export default Avatar;