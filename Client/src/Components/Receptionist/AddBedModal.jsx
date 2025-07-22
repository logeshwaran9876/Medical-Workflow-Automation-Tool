import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiInfo } from 'react-icons/fi';
import { FaBed, FaProcedures } from 'react-icons/fa';
import axios from 'axios';
const AddBedModal = ({ wards, onClose, onAdd }) => {
   const token= localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    bedNumber: '',
    ward: '',
    ratePerDay: '',
    features: []
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.bedNumber || !formData.ward || !formData.ratePerDay) {
        throw new Error('Please fill all required fields');
      }

      const response = await axios.post('http://localhost:5000/api/beds', {
        ...formData,
        ratePerDay: Number(formData.ratePerDay),
         headers: { Authorization: `Bearer ${token}` } 
      });

      onAdd(); // Refresh beds list
      onClose(); // Close modal
    } catch (err) {
      console.error('Error creating bed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create bed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
        >
          <div className="flex justify-between items-center border-b p-4 bg-indigo-50 rounded-t-xl">
            <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
              <FaBed className="mr-2" />
              Add New Bed
            </h3>
            <button 
              onClick={onClose}
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
                <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bed Number *
                </label>
                <input
                  type="text"
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g., B-101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward *
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map(ward => (
                    <option key={ward._id} value={ward._id}>
                      {ward.name} ({ward.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Per Day (₹) *
                </label>
                <input
                  type="number"
                  name="ratePerDay"
                  value={formData.ratePerDay}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Oxygen, AC"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {feature}
                        <button 
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : 'Add Bed'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddBedModal;