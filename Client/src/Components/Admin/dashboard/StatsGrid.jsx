import React from 'react';
import StatsCard from '../ui/StatsCard';
import { FiUsers, FiCalendar, FiActivity, FiClock } from 'react-icons/fi';

const StatsGrid = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "1,284",
      change: "+12.5%",
      icon: <FiUsers size={24} />,
      color: "blue"
    },
    {
      title: "Appointments Today",
      value: "24",
      change: "+2 from yesterday",
      icon: <FiCalendar size={24} />,
      color: "green"
    },
    {
      title: "Avg. Wait Time",
      value: "12 mins",
      change: "-3 mins",
      icon: <FiClock size={24} />,
      color: "orange"
    },
    {
      title: "Clinic Activity",
      value: "82%",
      change: "+5.2%",
      icon: <FiActivity size={24} />,
      color: "purple"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;