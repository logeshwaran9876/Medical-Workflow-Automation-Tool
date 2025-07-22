// src/components/doctor/DoctorStatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DoctorStatsCard = ({ title, value, icon, color, trend }) => {
  const colors = {
    teal: 'bg-teal-100 text-teal-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  const iconColors = {
    teal: 'text-teal-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${colors[color]} rounded-2xl shadow-md p-5 relative overflow-hidden`}
    >
      <div className="absolute top-4 right-4 opacity-20">
        <div className="text-5xl">{icon}</div>
      </div>
      <div className="relative">
        <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-3 shadow-inner`}>
          <div className={`text-2xl ${iconColors[color]}`}>{icon}</div>
        </div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <div className={`mt-2 text-xs font-medium flex items-center ${
            trend.value > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorStatsCard;