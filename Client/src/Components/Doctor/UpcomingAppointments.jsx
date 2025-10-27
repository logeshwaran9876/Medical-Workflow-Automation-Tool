
import { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaCheck, FaNotesMedical } from 'react-icons/fa';
import { motion } from 'framer-motion';

const appointmentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  })
};

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("authToken");
 const doctorId = "686a8f4a8008f93e7b1c3487";
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
      
        const response = await fetch(`http://localhost:5000/api/appdoctors/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`/api/doctor/appointments/${id}/complete`, {
        method: 'PUT', 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setAppointments(appointments.filter(appt => appt.id !== id));
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-teal-800 mb-6 flex items-center">
        <FaCalendarAlt className="mr-2" />
        Upcoming Appointments
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No upcoming appointments scheduled
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, i) => (
            <motion.div
              key={appointment.id}
              custom={i}
              variants={appointmentVariants}
              initial="hidden"
              animate="visible"
              className="border border-teal-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <FaUser className="text-teal-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{appointment.patient.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FaClock className="mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleComplete(appointment.id)}
                    className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
                    title="Mark as completed"
                  >
                    <FaCheck />
                  </button>
                  <button 
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    title="Add notes"
                  >
                    <FaNotesMedical />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}