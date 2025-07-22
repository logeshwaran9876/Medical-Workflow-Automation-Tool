import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Card = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden';
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    flat: 'shadow-none',
  };

  const hoverClasses = hoverEffect ? 'transition-all hover:shadow-lg hover:-translate-y-0.5' : '';

  const combinedClasses = twMerge(
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    hoverClasses,
    className
  );

  return (
    <div
      ref={ref}
      className={combinedClasses}
      {...props}
    >
      {children}
    </div>
  );
});

Card.propTypes = {
  variant: PropTypes.oneOf(['default', 'elevated', 'flat']),
  hoverEffect: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Card.displayName = 'Card';

export default Card;