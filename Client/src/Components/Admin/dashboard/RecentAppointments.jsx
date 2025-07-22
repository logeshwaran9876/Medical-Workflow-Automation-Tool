import React, { useEffect, useState } from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Badge from '../ui/Batge';
import { toast } from 'react-toastify';

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusConfig = {
    completed: { color: "green", icon: <FiCheckCircle /> },
    upcoming: { color: "blue", icon: <FiClock /> },
    missed: { color: "red", icon: <FiAlertCircle /> }
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Appointments</h3>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.slice(0, 5).map((appointment) => (
            <div key={appointment._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${statusConfig[appointment.status]?.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200' : 
                                statusConfig[appointment.status]?.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 
                                'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'}`}>
                  {statusConfig[appointment.status]?.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{appointment.patient?.name || 'Unknown Patient'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.doctor?.name || 'Unknown Doctor'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">{new Date(appointment.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <Badge 
                  color={statusConfig[appointment.status]?.color || 'gray'}
                  size="sm"
                  className="mt-1"
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
        )}
      </div>
      {appointments.length > 0 && (
        <button className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All Appointments
        </button>
      )}
    </div>
  );
};

export default RecentAppointments;