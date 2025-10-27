import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import AppointmentsTable from './AppointmentsTable';
import AppointmentModal from './AppointmentModal';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]); // Depend on fetchAppointments

  const handleStatusChange = async (id, status) => {
    try {
      setAppointments(prev => 
        prev.map(app => app._id === id ? { ...app, status } : app)
      );

      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
      
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.message || 'Failed to update status');
      fetchAppointments(); // Re-fetch to ensure data consistency
    }
  };

  const handleAddAppointment = (newAppointment) => {
    fetchAppointments(); 
    setIsModalOpen(false);
    toast.success('Appointment created successfully');
  };

  const handleEditAppointment = (updatedAppointment) => {
    fetchAppointments(); 
    setIsModalOpen(false);
    toast.success('Appointment updated successfully');
  };

  const handleDeleteAppointment = (deletedId) => {
    fetchAppointments();
    toast.success('Appointment deleted successfully');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Button 
          onClick={fetchAppointments} // Call memoized fetch function
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Appointments</h1>
        <Button onClick={() => {
          setSelectedAppointment(null);
          setIsModalOpen(true);
        }}>
          + New Appointment
        </Button>
      </div>

      <AppointmentsTable 
        appointments={appointments} 
        onStatusUpdate={handleStatusChange}
        onEdit={(appointment) => {
          setSelectedAppointment(appointment);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteAppointment}
        onView={(appointment) => {
          console.log('View appointment:', appointment);
        }}
      />

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedAppointment(null);
          setIsModalOpen(false);
        }}
        onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
        appointmentData={selectedAppointment}
      />
    </div>
  );
}