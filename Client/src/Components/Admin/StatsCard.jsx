import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 opacity-10">
        <div className="text-7xl">{icon}</div>
      </div>
      <div className="relative">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
        {trend && (
          <div className={`mt-2 text-xs font-medium flex items-center ${
            trend.value > 0 ? 'text-green-200' : 'text-red-200'
          }`}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;