import { useState, useEffect } from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiInfo,
  FiHeart,
  FiDroplet,
  FiUserPlus,
} from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { toast } from "react-toastify";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const statusOptions = ["active", "inactive", "pending", "archived"];
const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const initialFormData = {
  name: "",
  age: "",
  gender: "",
  contact: "",
  condition: "",
  bloodType: "",
  status: "active",
};

export default function PatientModal({ isOpen, onClose, onSave, patientData }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (patientData) {
        setFormData({
          ...initialFormData,
          ...patientData,
          age: patientData.age?.toString() || "",
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, patientData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact is required";
    
    if (formData.age) {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        newErrors.age = "Age must be between 0-120";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
      };
      await onSave(dataToSave);
      toast.success(`Patient ${patientData ? "updated" : "created"} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {patientData ? "Edit Patient" : "New Patient"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              icon={<FiUser className="text-gray-400" />}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="30"
                error={errors.age}
                min="0"
                max="120"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions.map((g) => ({
                  value: g,
                  label: g,
                }))}
                placeholder="Select Gender"
                disabled={isSubmitting}
                icon={<FiUserPlus className="text-gray-400" />}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact *
            </label>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="9876543210"
              error={errors.contact}
              icon={<FiPhone className="text-gray-400" />}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blood Type
              </label>
              <Select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                options={bloodTypes.map((type) => ({
                  value: type,
                  label: type,
                }))}
                placeholder="Select Blood Type"
                disabled={isSubmitting}
                icon={<FiDroplet className="text-gray-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions.map((status) => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1),
                }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medical Condition
            </label>
            <Input
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="e.g. Diabetes"
              icon={<FiHeart className="text-gray-400" />}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="min-w-[120px]"
            >
              {patientData ? "Update" : "Add Patient"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}