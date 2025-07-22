import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiPlus } from 'react-icons/fi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  appointmentData = null 
}) => {
  const isEditMode = !!appointmentData;
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: new Date(),
    time: '',
    reason: '',
    status: 'scheduled'
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsFetchingData(true);
        try {
          const doctorsRes = await fetch('http://localhost:5000/api/doctor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

          if (!doctorsRes.ok) throw new Error('Failed to fetch doctors');
          const doctorsData = await doctorsRes.json();
          setDoctors(doctorsData);

          const patientsRes = await fetch('http://localhost:5000/api/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
          if (!patientsRes.ok) throw new Error('Failed to fetch patients');
          const patientsData = await patientsRes.json();
          setPatients(patientsData);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Error loading required data');
        } finally {
          setIsFetchingData(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && appointmentData) {
        setFormData({
          patientId: appointmentData.patient?._id || appointmentData.patientId || '',
          doctorId: appointmentData.doctor?._id || appointmentData.doctorId || '',
          date: appointmentData.date ? new Date(appointmentData.date) : new Date(),
          time: appointmentData.time || '',
          reason: appointmentData.reason || '',
          status: appointmentData.status || 'scheduled'
        });
      } else {
        setFormData({
          patientId: '',
          doctorId: '',
          date: new Date(),
          time: '',
          reason: '',
          status: 'scheduled'
        });
      }
    }
  }, [isOpen, appointmentData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const url = isEditMode && appointmentData._id 
        ? `http://localhost:5000/api/appointments/${appointmentData._id}`
        : "http://localhost:5000/api/appointments/";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date.toISOString()
        }),
       
       
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} appointment`);
      }

      const data = await response.json();
      onSave(data);
      toast.success(`Appointment ${isEditMode ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (err) {
      console.error('Appointment error:', err);
      toast.error(err.message || `Error ${isEditMode ? 'updating' : 'creating'} appointment`);
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour}:00`, `${hour}:30`);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEditMode ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>

        {isFetchingData ? (
          <div className="p-6 flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Patient
              </label>
              <Select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                icon={<FiUser className="text-gray-400" />}
                disabled={isLoading || patients.length === 0}
                options={patients.map(patient => ({
                  value: patient._id,
                  label: patient.name
                }))}
              />
              {patients.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No patients available</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Doctor
              </label>
              <Select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                icon={<FiUser className="text-gray-400" />}
                disabled={isLoading || doctors.length === 0}
                options={doctors.map(doctor => ({
                  value: doctor._id,
                  label: `${doctor.name} (${doctor.specialization})`
                }))}
              />
              {doctors.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No doctors available</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    disabled={isLoading}
                  />
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <Select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  icon={<FiClock className="text-gray-400" />}
                  disabled={isLoading}
                  options={timeSlots.map(time => ({
                    value: time,
                    label: time
                  }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <Input
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Appointment reason"
                disabled={isLoading}
              />
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={[
                    { value: "scheduled", label: "Scheduled" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "no-show", label: "No Show" },
                  ]}
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                icon={<FiPlus />}
                loading={isLoading}
                disabled={isLoading || doctors.length === 0 || patients.length === 0}
              >
                {isEditMode ? 'Update Appointment' : 'Create Appointment'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentModal;
