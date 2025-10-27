import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiUser,
  FiSearch, // Added for search bar icon
  FiX,
  FiSave, // Added FiSave for update button
  FiBell, // For notified status
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

const getDoctorId = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      throw new Error('Doctor ID not found in localStorage');
    }
    return userData.id;
  } catch (err) {
    console.error('Error getting doctor ID:', err);
    toast.error('Failed to load doctor information. Please log in again.');
    return null;
  }
};

const emptyForm = {
  patient: "",
  doctor: "", // This will be set dynamically from getDoctorId
  followUpDate: "",
};
const CustomModal = ({ isOpen, onClose, children, title, size = 'md', overlayClassName = '', className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[size];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm ${overlayClassName}`}
        onClick={onClose}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className={`bg-white rounded-xl shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto ${className}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close modal">
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
const CustomInput = ({ label, name, type = 'text', value, onChange, icon, error, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
        } focus:border-transparent`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const CustomSelect = ({ label, name, value, onChange, options, icon, error, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
        } focus:border-transparent`}
        {...props}
      >
        {options.length === 0 && <option value="" disabled>Loading data...</option>}
        {options.length > 0 && !value && <option value="" disabled>Select an option</option>}
        
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const CustomButton = ({ children, variant = 'primary', loading = false, onClick, type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
        variants[variant]
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
};
const CustomLoadingSpinner = ({ fullPage = false }) => (
  <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : ''}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
  </div>
);

export default function DoctorFollowUps() {
  const doctorId = getDoctorId(); // Get doctor ID dynamically

  const [followUps, setFollowUps] = useState([]);
  const [patients, setPatients] = useState([]); // Raw patient data
  const [formData, setFormData] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null); // Stores the full follow-up object when editing
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // For initial page load
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

  const token = localStorage.getItem("authToken"); // Get auth token
  const fetchFollowUps = useCallback(async () => {
    if (!doctorId) {
      setIsLoading(false); // Stop loading if no doctorId
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${API_BASE}/followups/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFollowUps(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load follow-ups.");
      console.error("Error fetching follow-ups:", err);
      setFollowUps([]);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, token]);
  const fetchPatients = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(Array.isArray(data) ? data : []); // Store raw patient data
    } catch (err) {
      toast.error("Failed to fetch patients for selection.");
      console.error("Error fetching patients:", err);
      setPatients([]);
    }
  }, [token]);
  useEffect(() => {
    if (doctorId) { // Only fetch if doctorId is available
      fetchFollowUps();
      fetchPatients();
    }
  }, [fetchFollowUps, fetchPatients, doctorId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.patient || !formData.followUpDate) {
      toast.error("Please select a patient and a follow-up date.");
      setIsSubmitting(false);
      return;
    }
    if (!doctorId) {
        toast.error("Doctor information missing. Cannot save follow-up.");
        setIsSubmitting(false);
        return;
    }


    try {
      const payload = { ...formData, doctor: doctorId }; // Ensure doctorId is always included

      if (selected) {
        await axios.put(`${API_BASE}/followups/${selected._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Follow-up updated successfully!");
      } else {
        await axios.post(`${API_BASE}/followups`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Follow-up scheduled successfully!");
      }

      await fetchFollowUps();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save follow-up.");
      console.error("Error saving follow-up:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this follow-up? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE}/followups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Follow-up deleted successfully!");
      await fetchFollowUps();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete follow-up.");
      console.error("Error deleting follow-up:", err);
    }
  };

  const handleOpenCreateModal = () => {
    setSelected(null);
    setFormData({ ...emptyForm, doctor: doctorId }); // Ensure doctorId is set for new form
    setIsModalOpen(true);
    fetchPatients(); // Re-fetch patients just in case
  };

  const handleOpenEditModal = (followUp) => {
    setSelected(followUp);
    setFormData({
      patient: followUp.patient?._id || "",
      doctor: followUp.doctor?._id || doctorId,
      followUpDate: followUp.followUpDate ? followUp.followUpDate.slice(0, 10) : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
    setSelected(null);
  };

  const filteredFollowUps = followUps.filter((f) => {
    const patientName = f.patient?.name?.toLowerCase() || "";
    const doctorName = f.doctor?.name?.toLowerCase() || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      patientName.includes(searchTermLower) ||
      doctorName.includes(searchTermLower)
    );
  });
  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: `${p.name} ${p.email ? `(${p.email})` : ''}`,
  }));


  if (isLoading) return <CustomLoadingSpinner fullPage />;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Follow-Ups</h1>
          <p className="text-gray-500 text-sm mt-1">
            {followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <CustomButton
            onClick={handleOpenCreateModal}
            variant="primary"
          >
            <div className="flex items-center gap-2">
              <FiPlus className="text-lg" />
              New Follow-Up
            </div>
          </CustomButton>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-Up Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status / Days Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredFollowUps.length > 0 ? (
                  filteredFollowUps.map((f) => {
                    const followUpDate = new Date(f.followUpDate);
                    const today = new Date();
                    followUpDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    const timeDiff = followUpDate.getTime() - today.getTime();
                    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    
                    let statusBadgeClass = '';
                    let statusText = '';

                    if (daysRemaining < 0) {
                        statusBadgeClass = 'bg-red-100 text-red-800 border border-red-200';
                        statusText = `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} overdue`;
                    } else if (daysRemaining === 0) {
                        statusBadgeClass = 'bg-orange-100 text-orange-800 border border-orange-200';
                        statusText = 'Due today';
                    } else if (daysRemaining <= 7) {
                        statusBadgeClass = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                        statusText = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
                    } else {
                        statusBadgeClass = 'bg-green-100 text-green-800 border border-green-200';
                        statusText = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
                    }

                    return (
                      <motion.tr
                        key={f._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ backgroundColor: 'rgba(240, 253, 250, 0.5)' }}
                        className="hover:bg-teal-50/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                              <FiUser className="text-teal-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {f.patient?.name || "Unknown Patient"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {f.patient?.contact || "No contact"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FiUser className="text-blue-600" />
                                </div>
                                <div className="ml-3 text-sm text-gray-900">
                                    {f.doctor?.name || "Unknown Doctor"}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {followUpDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                          {f.notified && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 gap-1">
                                <FiBell size={12} /> Notified
                              </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <CustomButton
                              onClick={() => handleOpenEditModal(f)}
                              variant="outline"
                              className="text-teal-600 hover:text-teal-900 transition-colors"
                              title="Edit"
                            >
                              <FiEdit />
                            </CustomButton>
                            <CustomButton
                              onClick={() => handleDelete(f._id)}
                              variant="danger"
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </CustomButton>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FiCalendar className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">No follow-ups scheduled</p>
                        <p className="text-sm mt-1">
                          {searchTerm ? 'Try a different search term' : 'Create a new follow-up to get started'}
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {}
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={selected ? 'Edit Follow-Up' : 'Schedule New Follow-Up'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {}
            <CustomSelect
              label="Patient"
              name="patient"
              value={formData.patient || ""}
              onChange={(e) => handleChange("patient", e.target.value)}
              options={patientOptions}
              icon={<FiUser className="text-gray-400" />}
              required
              disabled={!!selected || patientOptions.length === 0} // Disable if editing or no patients
            />
            {selected && (
              <p className="mt-1 text-xs text-gray-500 italic">
                Patient cannot be changed for existing follow-ups.
              </p>
            )}
            {!selected && patientOptions.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                No patients available for selection. Please add patients first.
              </p>
            )}

            {}
            <CustomInput
              label="Follow-Up Date"
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={(e) => handleChange("followUpDate", e.target.value)}
              icon={<FiCalendar className="text-gray-400" />}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <CustomButton
              type="button"
              onClick={handleCloseModal}
              variant="outline"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              loading={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? (
                selected ? 'Updating...' : 'Scheduling...'
              ) : selected ? (
                <> <FiSave className="w-4 h-4" /> Update Follow-Up </>
              ) : (
                <> <FiPlus className="w-4 h-4" /> Schedule Follow-Up </>
              )}
            </CustomButton>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}