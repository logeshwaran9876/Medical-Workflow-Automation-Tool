import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiEye, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Badge from '../ui/Batge';
import { useState } from 'react';
import PropTypes from 'prop-types';

const specializationColors = {
  cardiology: 'purple',
  neurology: 'blue',
  pediatrics: 'green',
  orthopedics: 'orange',
  dermatology: 'pink',
  'general medicine': 'gray',
  oncology: 'red',
  psychiatry: 'indigo',
  surgery: 'yellow'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  'on-leave': 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800'
};

export default function DoctorsTable({ 
  doctors = [], 
  onStatusUpdate = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {},
  onView = () => {},
}) {
  const [filters, setFilters] = useState({
    status: '',
    specialization: '',
    search: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Safe filtering with array check and optional chaining
  const filteredDoctors = Array.isArray(doctors) 
    ? doctors.filter(doctor => {
        const matchesStatus = filters.status === '' || doctor.status === filters.status;
        const matchesSpecialization = filters.specialization === '' || 
          doctor.specialization?.toLowerCase().includes(filters.specialization.toLowerCase());
        const matchesSearch = filters.search === '' || 
          `${doctor.name}`.toLowerCase().includes(filters.search.toLowerCase()) ||
          doctor.email?.toLowerCase().includes(filters.search.toLowerCase());

        return matchesStatus && matchesSpecialization && matchesSearch;
      })
    : [];

  // Safe unique specializations
  const uniqueSpecializations = Array.isArray(doctors) 
    ? [...new Set(doctors.map(d => d.specialization).filter(Boolean))]
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      {/* Filter Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
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
          
          {/* Specialization Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Specializations</option>
              {uniqueSpecializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search doctors..."
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <motion.tr 
                  key={doctor._id || doctor.id}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Doctor Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        {doctor.avatar ? (
                          <img 
                            src={doctor.avatar} 
                            alt={doctor.name} 
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-indigo-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Dr. {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {doctor.schedule || 'Schedule not set'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <FiMail className="mr-2 text-gray-400" />
                      {doctor.email || 'No email'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <FiPhone className="mr-2 text-gray-400" />
                      {doctor.phone || 'No phone'}
                    </div>
                  </td>
                  
                  {/* Specialization */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      color={specializationColors[doctor.specialization?.toLowerCase()] || 'gray'}
                    >
                      {doctor.specialization || 'Not specified'}
                    </Badge>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doctor.status]}`}>
                      {doctor.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onView(doctor)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(doctor)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(doctor._id || doctor.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
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
                  {Array.isArray(doctors) && doctors.length === 0 
                    ? 'No doctors available' 
                    : 'No doctors found matching your filters'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DoctorsTable.propTypes = {
  doctors: PropTypes.array.isRequired,
  onStatusUpdate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func
};

DoctorsTable.defaultProps = {
  doctors: [],
  onStatusUpdate: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onView: () => {}
};