// DoctorLogo.js
import React from 'react';

const DoctorLogo = ({ size = 100, color = '#3B82F6' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle background */}
      <circle cx="50" cy="50" r="45" fill={color} opacity="0.2" />
      
      {/* Medical cross symbol */}
      <path 
        d="M50 30V70M30 50H70" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      
      {/* Heart pulse at bottom */}
      <path 
        d="M30 65L40 60L50 70L60 55L70 65" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Optional stethoscope loop */}
      <circle cx="50" cy="35" r="8" stroke={color} strokeWidth="3" fill="none" />
    </svg>
  );
};

export default DoctorLogo;