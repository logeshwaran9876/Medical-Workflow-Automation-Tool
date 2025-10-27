
import { useState, useEffect } from 'react';
import DoctorsTable from './DoctorsTable';
import DoctorModal from './DoctorModal';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

export default function Doctors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  useEffect(() => {
    let isMounted = true;
    
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/doctor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        if (isMounted) setDoctors(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          toast.error(err.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDoctors();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setDoctors(prev =>
        prev.map(doc => doc._id === id ? { ...doc, status: newStatus } : doc)
      );

      const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      
       
      });

      if (!response.ok) throw new Error('Failed to update status');
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddDoctor = (newDoctor) => {
    setDoctors(prev => [...prev, newDoctor]);
    setIsModalOpen(false);
    toast.success('Doctor created');
  };

  const handleEditDoctor = (updatedDoctor) => {
    setDoctors(prev =>
      prev.map(doc => doc._id === updatedDoctor._id ? updatedDoctor : doc)
    );
    setIsModalOpen(false);
    toast.success('Doctor updated');
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/doctor/${id}`, {
        method: 'DELETE',
      
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete doctor');

      setDoctors(prev => prev.filter(doc => doc._id !== id));
      toast.success('Doctor deleted');
    } catch (err) {
      toast.error(err.message);
    }
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
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Doctors</h1>
        <Button
          onClick={() => {
            setSelectedDoctor(null);
            setIsModalOpen(true);
          }}
        >
          + New Doctor
        </Button>
      </div>

      <DoctorsTable
        doctors={doctors}
        onStatusUpdate={handleStatusChange}
        onEdit={(doctor) => {
          setSelectedDoctor(doctor);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteDoctor}
        onView={(doctor) => {
          toast.info(`Viewing profile: Dr. ${doctor.firstName} ${doctor.lastName}`);
        }}
      />

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedDoctor(null);
          setIsModalOpen(false);
        }}
        onSave={selectedDoctor ? handleEditDoctor : handleAddDoctor}
        doctorData={selectedDoctor}
      />
    </div>
  );
}