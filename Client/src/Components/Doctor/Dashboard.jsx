
import { useState, useEffect } from 'react';
import DoctorStatsCard from './DoctorStatsCard';
import { FaCalendarCheck, FaUserInjured, FaNotesMedical, FaClock } from 'react-icons/fa';
import UpcomingAppointments from './UpcomingAppointments';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    patients: 0,
    prescriptions: 0,
    waiting: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/doctor/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DoctorStatsCard 
          title="Today's Appointments" 
          value={stats.appointments} 
          icon={<FaCalendarCheck />} 
          color="teal" 
          trend={{ value: 12, label: 'from yesterday' }}
        />
        <DoctorStatsCard 
          title="Active Patients" 
          value={stats.patients} 
          icon={<FaUserInjured />} 
          color="blue" 
        />
        <DoctorStatsCard 
          title="Prescriptions" 
          value={stats.prescriptions} 
          icon={<FaNotesMedical />} 
          color="amber" 
        />
        <DoctorStatsCard 
          title="Waiting" 
          value={stats.waiting} 
          icon={<FaClock />} 
          color="purple" 
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <UpcomingAppointments />
      </motion.div>
    </motion.div>
  );
}