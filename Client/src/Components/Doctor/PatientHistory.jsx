
import { useState, useEffect } from 'react';
import {
  FiEdit, FiTrash2, FiUser, FiPhone,
  FiHeart, FiDroplet, FiUserPlus, FiInfo
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import SearchBar from './ui/SearchBar';
import LoadingSpinner from './ui/LoadingSpinner';
import Badge from './ui/Badge';

const API_BASE_URL = 'http://localhost:5000/api';

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const statusOptions = ['active', 'inactive', 'pending', 'archived'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const initialFormData = {
  name: '', age: '', gender: '', contact: '', condition: '', bloodType: '', status: 'active',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-blue-100 text-blue-800',
};

export default function PatientManager() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem("authToken");
  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => {
    const filtered = patients.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contact?.includes(searchTerm) ||
      p.condition?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(searchTerm ? filtered : patients);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(data);
      setFilteredPatients(data);
    } catch {
      toast.error('Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 120)) {
      newErrors.age = 'Age must be between 0-120';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = (patient = null) => {
    setSelectedPatient(patient);
    setFormData(patient ? { ...patient, age: patient.age?.toString() } : initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataToSave = { ...formData, age: Number(formData.age) };
      let response;
      if (selectedPatient) {
        response = await axios.put(`${API_BASE_URL}/patients/${selectedPatient._id}`, dataToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


        setPatients(prev => prev.map(p => p._id === response.data._id ? response.data : p));
        toast.success('Patient updated');
      } else {
        response = await axios.post(`${API_BASE_URL}/patients`, dataToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        setPatients(prev => [...prev, response.data]);
        toast.success('Patient added');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/patients/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPatients(prev => prev.map(p => p._id === id ? data : p));
    } catch {
      toast.error('Status update failed');
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search patients..." />
        
        </div>
      </div>

      <div className="rounded-2xl overflow-x-auto border border-teal-100 shadow-md bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-50">
            <tr>
              {['Patient', 'Contact', 'Blood Type', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase text-teal-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.length > 0 ? filteredPatients.map((p) => (
              <motion.tr key={p._id} whileHover={{ scale: 1.01 }} className="transition">
                <td className="px-6 py-4 flex items-center gap-2">
                  <FiUser className="text-teal-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                    <div className="text-sm text-gray-400">{p.age} yrs • {p.gender}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{p.contact}<br /><span className="text-gray-400">{p.condition || 'N/A'}</span></td>
                <td className="px-6 py-4"><Badge color={p.bloodType ? 'indigo' : 'gray'}>{p.bloodType || 'Unknown'}</Badge></td>
                <td className="px-6 py-4">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-3 py-1 ${statusColors[p.status]}`}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => openModal(p)}><FiEdit className="text-yellow-500" /></button>
                  <button onClick={() => handleDeletePatient(p._id)}><FiTrash2 className="text-red-500" /></button>
                </td>
              </motion.tr>
            )) : (
              <tr><td colSpan="5" className="text-center px-6 py-4 text-gray-400">No patients found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSavePatient} className="p-6 space-y-4 bg-white rounded-2xl">
          <h2 className="text-xl font-semibold">{selectedPatient ? 'Edit Patient' : 'New Patient'}</h2>
          <Input name="name" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} error={errors.name} icon={<FiUser />} />
          <Input name="age" type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))} error={errors.age} icon={<FiInfo />} />
          <Select name="gender" value={formData.gender} onChange={(e) => setFormData(p => ({ ...p, gender: e.target.value }))} options={genderOptions.map(g => ({ value: g, label: g }))} icon={<FiUserPlus />} />
          <Input name="contact" placeholder="Contact" value={formData.contact} onChange={(e) => setFormData(p => ({ ...p, contact: e.target.value }))} error={errors.contact} icon={<FiPhone />} />
          <Input name="condition" placeholder="Condition" value={formData.condition} onChange={(e) => setFormData(p => ({ ...p, condition: e.target.value }))} icon={<FiHeart />} />
          <Select name="bloodType" value={formData.bloodType} onChange={(e) => setFormData(p => ({ ...p, bloodType: e.target.value }))} options={bloodTypes.map(b => ({ value: b, label: b }))} icon={<FiDroplet />} />
          <Select name="status" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} options={statusOptions.map(s => ({ value: s, label: s }))} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>{selectedPatient ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}