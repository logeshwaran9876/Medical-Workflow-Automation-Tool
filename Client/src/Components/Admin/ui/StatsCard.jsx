import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue',
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    green: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    orange: 'bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    purple: 'bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    red: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  };

  const iconColors = {
    blue: 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800/50',
    green: 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-800/50',
    orange: 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-800/50',
    purple: 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-800/50',
    red: 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800/50'
  };

  return (
    <div className={twMerge(
      'rounded-lg border p-6 transition-all hover:shadow-md',
      colorClasses[color] || colorClasses.blue,
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p className={`text-xs mt-2 ${
              change.startsWith('+') 
                ? 'text-green-600 dark:text-green-400' 
                : change.startsWith('-')
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={twMerge(
            'p-3 rounded-lg',
            iconColors[color] || iconColors.blue
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  icon: PropTypes.element,
  color: PropTypes.oneOf(['blue', 'green', 'orange', 'purple', 'red']),
  className: PropTypes.string
};

export default StatsCard;