import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock, FiUser, FiCalendar, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-purple-100 text-purple-800',
};

const AppointmentsTable = ({ 
  appointments = [], 
  onStatusUpdate = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {},
  onView = () => {},
}) => {
  const [filters, setFilters] = useState({
    status: '',
    doctor: '',
    patient: '',
    dateFrom: '',
    dateTo: ''
  });

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
        
          Authorization: `Bearer ${token}`,
        },
      });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete appointment');
        }

        onDelete(id);
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Error deleting appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filters.status === '' || appointment.status === filters.status;
    const matchesDoctor = filters.doctor === '' || 
      (appointment.doctor?.name && appointment.doctor.name.includes(filters.doctor));
    const matchesPatient = filters.patient === '' || 
      (appointment.patient?.name && appointment.patient.name.includes(filters.patient));
    const matchesDateFrom = filters.dateFrom === '' || 
      new Date(appointment.date) >= new Date(filters.dateFrom);
    const matchesDateTo = filters.dateTo === '' || 
      new Date(appointment.date) <= new Date(filters.dateTo);

    return matchesStatus && matchesDoctor && matchesPatient && matchesDateFrom && matchesDateTo;
  });

  // Get unique doctors and patients for filter dropdowns
  const uniqueDoctors = [...new Set(appointments
    .map(a => a.doctor?.name)
    .filter(name => name !== undefined && name !== null))];
  
  const uniquePatients = [...new Set(appointments
    .map(a => a.patient?.name)
    .filter(name => name !== undefined && name !== null))];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      {/* Filter Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Statuses</option>
              {Object.keys(statusColors).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
            <select
              name="doctor"
              value={filters.doctor}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Doctors</option>
              {uniqueDoctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
            <select
              name="patient"
              value={filters.patient}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Patients</option>
              {uniquePatients.map(patient => (
                <option key={patient} value={patient}>{patient}</option>
              ))}
            </select>
          </div>
        </div>
        
   
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <motion.tr 
                  key={appointment._id}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.patient?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.department || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(appointment.date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {appointment.doctor?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onView(appointment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(appointment)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(appointment._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No appointments found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AppointmentsTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  onStatusUpdate: PropTypes.func,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default AppointmentsTable;



