import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiEye ,FiUser} from 'react-icons/fi';
import Badge from '../ui/Batge';

const statusColors = {
  'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'archived': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

export default function PatientsTable({ 
  patients = [], 
  onStatusChange = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {},
  onView = () => {},
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <motion.tr 
                  key={patient._id}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900">
                        <FiUser className="text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {patient.age} years • {patient.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {patient.contact}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {patient.condition || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={patient.bloodType ? 'indigo' : 'gray'}>
                      {patient.bloodType || 'Unknown'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                      {patient.status  || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onView(patient)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(patient)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/50"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(patient._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
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
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}