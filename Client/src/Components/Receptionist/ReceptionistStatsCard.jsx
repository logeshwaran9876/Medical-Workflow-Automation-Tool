import React from 'react';
import { motion } from 'framer-motion';

const ReceptionistStatsCard = ({ title, value, icon, color, trend }) => {
  const colorVariants = {
    indigo: {
      bg: 'bg-indigo-100/80',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-200/70',
      iconColor: 'text-indigo-600',
      border: 'border-indigo-200'
    },
    teal: {
      bg: 'bg-teal-100/80',
      text: 'text-teal-800',
      iconBg: 'bg-teal-200/70',
      iconColor: 'text-teal-600',
      border: 'border-teal-200'
    },
    amber: {
      bg: 'bg-amber-100/80',
      text: 'text-amber-800',
      iconBg: 'bg-amber-200/70',
      iconColor: 'text-amber-600',
      border: 'border-amber-200'
    },
    purple: {
      bg: 'bg-purple-100/80',
      text: 'text-purple-800',
      iconBg: 'bg-purple-200/70',
      iconColor: 'text-purple-600',
      border: 'border-purple-200'
    },
    pink: {
      bg: 'bg-pink-100/80',
      text: 'text-pink-800',
      iconBg: 'bg-pink-200/70',
      iconColor: 'text-pink-600',
      border: 'border-pink-200'
    }
  };

  const selectedColor = colorVariants[color] || colorVariants.indigo;

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`${selectedColor.bg} ${selectedColor.border} rounded-2xl shadow-sm p-5 relative overflow-hidden border backdrop-blur-sm`}
    >
      {}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ 
        background: `radial-gradient(circle, ${selectedColor.iconColor} 0%, transparent 70%)`
      }}></div>
      
      <div className="relative z-10">
        <div className={`w-12 h-12 ${selectedColor.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-inner`}>
          <div className={`text-2xl ${selectedColor.iconColor}`}>{icon}</div>
        </div>
        
        <p className="text-sm font-medium opacity-90">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        
        {trend && (
          <div className={`mt-2 text-xs font-medium flex items-center ${
            trend.value > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.value > 0 ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReceptionistStatsCard;