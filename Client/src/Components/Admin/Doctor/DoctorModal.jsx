
import { useState, useEffect } from 'react';
import {
  FiX, FiUser, FiMail, FiPhone,
  FiBriefcase, FiCalendar
} from 'react-icons/fi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { toast } from 'react-toastify';

const specializationOptions = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'General Medicine', 'Oncology', 'Psychiatry', 'Surgery'
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'on-leave', label: 'On Leave' },
  { value: 'inactive', label: 'Inactive' }
];

export default function DoctorModal({
  isOpen,
  onClose,
  onSave,
  doctorData = null
}) {
  const isEditMode = !!doctorData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'General Medicine',
    status: 'active',
    schedule: 'Mon-Fri, 9am-5pm',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: doctorData?.name || '',
        email: doctorData?.email || '',
        phone: doctorData?.phone || '',
        specialization: doctorData?.specialization || 'General Medicine',
        status: doctorData?.status || 'active',
        schedule: doctorData?.schedule || 'Mon-Fri, 9am-5pm',
        avatar: doctorData?.avatar || ''
      });
    }
  }, [isOpen, doctorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {       
      const token = localStorage.getItem("authToken");
      const url = isEditMode && doctorData._id
        ? `http://localhost:5000/api/doctor/${doctorData._id}`
        : "http://localhost:5000/api/doctor";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isEditMode ? 'update' : 'create'} doctor`);
      }
      const savedDoctor = responseData.doctor || responseData.data || responseData;
      if (!savedDoctor?.name) {
        throw new Error("Invalid doctor data received from server");
      }

      onSave(savedDoctor);
      toast.success(`Doctor ${isEditMode ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (err) {
      console.error('Doctor operation error:', err);
      toast.error(err.message || `Error ${isEditMode ? 'updating' : 'creating'} doctor`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEditMode ? 'Edit Doctor' : 'New Doctor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              icon={<FiUser className="text-gray-400" />}
              placeholder="Dr. John Doe"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              icon={<FiMail className="text-gray-400" />}
              placeholder="doctor@example.com"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
              icon={<FiPhone className="text-gray-400" />}
              placeholder="+1234567890"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              disabled={isLoading}
              icon={<FiBriefcase className="text-gray-400" />}
              options={specializationOptions.map(spec => ({
                value: spec,
                label: spec
              }))}
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Schedule
            </label>
            <Input
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              disabled={isLoading}
              icon={<FiCalendar className="text-gray-400" />}
              placeholder="Mon-Fri, 9am-5pm"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
              options={statusOptions}
            />
          </div>

          {}
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
              loading={isLoading}
            >
              {isEditMode ? 'Update Doctor' : 'Create Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}