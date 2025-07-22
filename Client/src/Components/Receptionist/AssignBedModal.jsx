import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiPhone, FiCalendar, FiInfo, FiDollarSign } from 'react-icons/fi';

const AssignBedModal = ({ bed, patients, onClose, onAssign }) => {
  const [patientId, setPatientId] = useState('');
  
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDischarge, setExpectedDischarge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token= localStorage.getItem("authToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`http://localhost:5000/api/beds/${bed._id}/assign`, {
        patientId,
        admissionDate,
        expectedDischarge,
        headers: {
                    Authorization: `Bearer ${token}`,
                }
      });
      onAssign();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign patient');
      console.error('Error assigning patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg"
        >
          <div className="flex justify-between items-center border-b p-4 bg-indigo-50 rounded-t-xl">
            <h3 className="text-lg font-semibold text-indigo-800">
              Assign Patient to Bed <span className="font-bold">{bed.bedNumber}</span>
            </h3>
            <button 
              onClick={onClose} 
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FiInfo size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Ward: {bed.ward?.name}</h4>
                <p className="text-sm text-gray-600 capitalize">Type: {bed.ward?.type}</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <FiDollarSign className="mr-1" /> {bed.ratePerDay}/day
                </span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FiX className="mr-2" size={18} />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-indigo-500" /> Patient*
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} (ID: {patient.registrationId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2 text-indigo-500" /> Admission Date*
                </label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2 text-indigo-500" /> Expected Discharge
                </label>
                <input
                  type="date"
                  value={expectedDischarge}
                  onChange={(e) => setExpectedDischarge(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {bed.features?.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center min-w-[120px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning...
                  </>
                ) : 'Assign Patient'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssignBedModal;