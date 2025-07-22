import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FiUser,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiClock,
  FiActivity,
  FiPlusCircle,
  FiSave,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import SearchBar from "./ui/SearchBar";
import LoadingSpinner from "./ui/LoadingSpinner";
import { toast } from "react-toastify";

// Custom Select Component (as provided, ensure this is in a separate file if used elsewhere)
const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  className = "",
  ...props
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
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
        className={`block w-full ${
          icon ? "pl-10" : "pl-3"
        } pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
        {...props}
      >
        {options.length === 0 && <option value="" disabled>Loading options...</option>}
        {options.length > 0 && !value && <option value="" disabled>Select an option</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const getDoctorId = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      throw new Error("Doctor data not found in localStorage");
    }
    return userData.id;
  } catch (err) {
    console.error("Error getting doctor ID:", err);
    toast.error("Failed to load doctor information");
    return null;
  }
};

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  appointment: "",
  notes: "",
  meds: [{ name: "", dosage: "", frequency: "" }],
};

export default function DoctorPrescriptions() {
  const doctorId = getDoctorId();

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]); // All appointments for this doctor
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("authToken");

  // Status badge styles for appointments
  const statusBadgeStyles = {
    scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
  };

  // --- Data Fetching ---

  // Fetches ALL prescriptions for the CURRENT doctor
  const fetchPrescriptions = useCallback(async () => {
    if (!doctorId) return; // Prevent fetching if doctorId is null
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${API_BASE_URL}/prescriptions/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch prescriptions.");
      console.error("Error fetching prescriptions:", err);
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, token]);

  // Fetches ONLY 'completed' appointments for the CURRENT doctor
  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return; // Prevent fetching if doctorId is null
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/appdoctors/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filter for 'completed' appointments
      const completedAppointments = data.filter(
        (appt) => appt.status === "completed"
      );
      setAppointments(completedAppointments);
    } catch (err) {
      toast.error("Failed to fetch completed appointments for selection.");
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  }, [doctorId, token]);

  // Initial data load on component mount
  useEffect(() => {
    if (doctorId) { // Only fetch if doctorId is available
      fetchPrescriptions();
      fetchAppointments();
    }
  }, [fetchPrescriptions, fetchAppointments, doctorId]);

  // --- Form Handling ---

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedsChange = (index, field, value) => {
    const updatedMeds = [...formData.meds];
    updatedMeds[index][field] = value;
    setFormData((prev) => ({ ...prev, meds: updatedMeds }));
  };

  const addMedField = () => {
    setFormData((prev) => ({
      ...prev,
      meds: [...prev.meds, { name: "", dosage: "", frequency: "" }],
    }));
  };

  const removeMedField = (index) => {
    const updatedMeds = formData.meds.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, meds: updatedMeds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasEmptyMedFields = formData.meds.some(
      (med) => !med.name.trim() || !med.dosage.trim() || !med.frequency.trim()
    );

    if (hasEmptyMedFields && formData.meds.length > 0) {
      toast.error("Please fill in all medication fields or remove empty ones.");
      setIsSubmitting(false);
      return;
    }

    // When creating, appointment must be selected
    if (!selectedPrescription && !formData.appointment) {
      toast.error("Please select an appointment for the prescription.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (selectedPrescription) {
        // Update existing prescription
        await axios.put(
          `${API_BASE_URL}/prescriptions/${selectedPrescription._id}`,
          {
            notes: formData.notes,
            meds: formData.meds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Prescription updated successfully!");
      } else {
        // Create new prescription
        await axios.post(
          `${API_BASE_URL}/prescriptions/${formData.appointment}`, // Ensure endpoint uses appointment ID
          {
            notes: formData.notes,
            meds: formData.meds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Prescription created successfully!");
      }
      await fetchPrescriptions();
      setIsModalOpen(false);
      setFormData(emptyForm);
      setSelectedPrescription(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving prescription.");
      console.error("Error saving prescription:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this prescription? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(`${API_BASE_URL}/prescriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Prescription deleted successfully!");
      await fetchPrescriptions();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete prescription."
      );
      console.error("Error deleting prescription:", err);
    }
  };

  // --- Modal Management ---

  const handleOpenCreateModal = () => {
    setSelectedPrescription(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
    fetchAppointments(); // Re-fetch appointments to ensure fresh list for new prescription
  };

  const handleOpenEditModal = (prescription) => {
    setSelectedPrescription(prescription);
    setFormData({
      appointment: prescription.appointment?._id || "", // Pre-fill with existing appointment ID
      notes: prescription.notes || "",
      meds:
        prescription.meds && prescription.meds.length > 0
          ? prescription.meds.map((med) => ({ ...med }))
          : [{ name: "", dosage: "", frequency: "" }], // Ensure at least one empty med field for editing
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
    setSelectedPrescription(null);
  };

  // --- Filtering and Display ---

  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = p.appointment?.patient?.name?.toLowerCase() || "";
    const doctorName = p.appointment?.doctor?.name?.toLowerCase() || "";
    const notes = p.notes?.toLowerCase() || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      patientName.includes(searchTermLower) ||
      doctorName.includes(searchTermLower) ||
      notes.includes(searchTermLower) ||
      p.meds.some(
        (med) =>
          med.name?.toLowerCase().includes(searchTermLower) ||
          med.dosage?.toLowerCase().includes(searchTermLower) ||
          med.frequency?.toLowerCase().includes(searchTermLower)
      )
    );
  });

  // Prepare options for the Select component for appointments
  const appointmentOptions = appointments.map((appt) => ({
    value: appt._id,
    label: `${appt.patient?.name || "Unknown Patient"} - ${new Date(
      appt.date
    ).toLocaleDateString("en-IN")} @ ${appt.time}`,
  }));

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Prescription Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {prescriptions.length} prescription
            {prescriptions.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient, doctor, notes, meds..."
          />
          <Button onClick={handleOpenCreateModal} variant="primary">
            <div className="flex items-center gap-2">
              <FiPlus className="text-lg" />
              New Prescription
            </div>
          </Button>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Appointment Details
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((p, index) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group hover:bg-teal-50 transition-all duration-300 rounded-xl"
                    >
                      {/* Appointment Details Column (Date, Time, Status) */}
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-gray-900 font-semibold">
                            <FiCalendar className="text-gray-500" size={14} />
                            {new Date(p.appointment?.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <FiClock className="text-gray-500" size={14} />
                            {p.appointment?.time || "--:--"}
                          </div>
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-sm border ${
                              statusBadgeStyles[p.appointment?.status] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {p.appointment?.status?.charAt(0).toUpperCase() +
                              p.appointment?.status.slice(1) || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Patient Name */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-teal-500" />
                          {p.appointment?.patient?.name || "Unknown Patient"}
                        </div>
                      </td>

                      {/* Doctor Name */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-blue-500" />
                          {p.appointment?.doctor?.name || "Unknown Doctor"}
                        </div>
                      </td>

                      {/* Medications */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {p.meds?.length ? (
                          <ul className="space-y-1">
                            {p.meds.map((m, i) => (
                              <li key={i} className="flex flex-col">
                                <span className="font-semibold">{m.name}</span>
                                <span className="text-xs text-gray-500 italic">
                                  {m.dosage} — {m.frequency}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="italic text-gray-400">
                            No medications
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {p.notes ? (
                          <span title={p.notes}>{p.notes}</span>
                        ) : (
                          <span className="italic text-gray-400">No notes</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-yellow-500 hover:text-yellow-600 transition"
                          title="Edit Prescription"
                          onClick={() => handleOpenEditModal(p)}
                        >
                          <FiEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-600 transition"
                          title="Delete Prescription"
                          onClick={() => handleDelete(p._id)}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-400 italic text-sm"
                    >
                      No prescriptions found for this doctor.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedPrescription ? "Edit Prescription" : "Create New Prescription"
        }
        size="xl"
        overlayClassName="backdrop-blur-sm bg-black/30"
        className="rounded-xl shadow-2xl border border-gray-100"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appointment select - Now using the custom Select component */}
          <Select
            label="Appointment"
            name="appointment"
            value={formData.appointment}
            onChange={(e) => handleChange("appointment", e.target.value)}
            options={appointmentOptions}
            icon={<FiCalendar className="text-gray-500" />}
            required
            disabled={!!selectedPrescription || appointmentOptions.length === 0} // Disable if editing or no completed appointments
          />
          {selectedPrescription && (
            <p className="mt-2 text-xs text-gray-400 italic">
              Cannot change appointment for existing prescriptions.
            </p>
          )}
          {!selectedPrescription && appointmentOptions.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              No completed appointments available for new prescriptions.
            </p>
          )}

          {/* Notes input */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <FiFileText className="text-teal-500" /> Prescription Notes
            </label>
            <textarea
              name="notes"
              placeholder="Enter any additional instructions or notes for this prescription..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Meds inputs */}
          <div className="space-y-4 p-5 border border-gray-100 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FiActivity className="text-teal-500" /> Medications
              </h3>
              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                {formData.meds.length}{" "}
                {formData.meds.length === 1 ? "medication" : "medications"}
              </span>
            </div>

            <div className="space-y-4">
              {formData.meds.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-white p-3 rounded-lg border border-gray-100 shadow-xs"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Medication
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Amoxicillin"
                      value={med.name}
                      onChange={(e) =>
                        handleMedsChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedsChange(index, "dosage", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2x daily"
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedsChange(index, "frequency", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    {formData.meds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedField(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove medication"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMedField}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-dashed border-teal-200 transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" />
              Add Medication
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {selectedPrescription ? (
                    <>
                      <FiSave className="w-4 h-4" />
                      Update Prescription
                    </>
                  ) : (
                    <>
                      <FiPlusCircle className="w-4 h-4" />
                      Create Prescription
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}