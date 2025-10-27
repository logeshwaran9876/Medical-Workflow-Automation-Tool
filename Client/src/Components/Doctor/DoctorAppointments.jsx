import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiSearch,
  FiX,
  FiFileText,
  FiRefreshCcw, // Added for retry button icon
} from "react-icons/fi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

const API_BASE_URL = "http://localhost:5000/api";
const statusColors = {
  scheduled: "bg-blue-50 text-blue-700 ring-blue-600/20",
  completed: "bg-green-50 text-green-700 ring-green-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  "no-show": "bg-gray-50 text-gray-700 ring-gray-600/20",
};

const statusBadgeStyles = {
  scheduled: "border-blue-300 bg-blue-100 text-blue-800",
  completed: "border-green-300 bg-green-100 text-green-800",
  cancelled: "border-red-300 bg-red-100 text-red-800",
  "no-show": "border-gray-300 bg-gray-100 text-gray-800",
};
const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
  error,
  className = "",
  ...props
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
    )}
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
        className={`block w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        } focus:border-transparent`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  error,
  className = "",
  ...props
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
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
        className={`block w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        } focus:border-transparent`}
        {...props}
      >
        {options.length === 0 && (
          <option value="" disabled>
            Loading data...
          </option>
        )}
        {options.length > 0 && !value && (
          <option value="" disabled>
            Select an option
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const Button = ({
  children,
  variant = "primary",
  loading = false,
  onClick,
  type = "button",
  className = "",
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
        variants[variant]
      } ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
const LoadingSpinner = ({ fullPage = false }) => (
  <div
    className={`flex items-center justify-center ${fullPage ? "h-screen" : ""}`}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppointmentsTable = ({
  appointments = [],
  onStatusUpdate = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onNewAppointment = () => {},
  isDoctorView = false,
}) => {
  const [filters, setFilters] = useState({
    status: "",
    doctor: "",
    patient: "",
    dateFrom: "",
    dateTo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      searchTerm === "" ||
      (appointment.patient?.name &&
        appointment.patient.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (appointment.doctor?.name &&
        appointment.doctor.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (appointment.reason &&
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filters.status === "" || appointment.status === filters.status;
    const matchesDoctor =
      filters.doctor === "" ||
      (appointment.doctor?.name &&
        appointment.doctor.name.includes(filters.doctor));
    const matchesPatient =
      filters.patient === "" ||
      (appointment.patient?.name &&
        appointment.patient.name.includes(filters.patient));
    const matchesDateFrom =
      filters.dateFrom === "" ||
      new Date(appointment.date) >= new Date(filters.dateFrom);
    const matchesDateTo =
      filters.dateTo === "" ||
      new Date(appointment.date) <= new Date(filters.dateTo);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDoctor &&
      matchesPatient &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
  const uniqueDoctors = [
    ...new Set(
      appointments
        .map((a) => a.doctor?.name)
        .filter((name) => name !== undefined && name !== null)
    ),
  ];

  const uniquePatients = [
    ...new Set(
      appointments
        .map((a) => a.patient?.name)
        .filter((name) => name !== undefined && name !== null)
    ),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-black">
            Appointments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-black-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-white-700 dark:border-white-600 dark:text-black"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {}
      <div className="rounded-2xl overflow-x-auto border border-blue-100 shadow-md bg-white p-4">
        {" "}
        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md  dark:text-black focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {!isDoctorView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Doctor
              </label>
              <select
                name="doctor"
                value={filters.doctor}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md  dark:text-black focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Doctors</option>
                {uniqueDoctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Patient
            </label>
            <select
              name="patient"
              value={filters.patient}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md  dark:text-black focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Patients</option>
              {uniquePatients.map((patient) => (
                <option key={patient} value={patient}>
                  {patient}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <Input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              icon={<FiCalendar className="text-gray-400" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <Input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              icon={<FiCalendar className="text-gray-400" />}
            />
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className=" overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              {" "}
              {}
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Appointment Details
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                {!isDoctorView && (
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                )}
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group hover:bg-blue-50 transition-all duration-300" // Changed hover color to blue
                    >
                      {}
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-gray-900 font-semibold">
                            <FiCalendar className="text-gray-500" size={14} />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <FiClock className="text-gray-500" size={14} />
                            {appointment.time || "--:--"}
                          </div>
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-sm border ${
                              statusBadgeStyles[appointment.status] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>
                      </td>

                      {}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-blue-500" />{" "}
                          {}
                          {appointment.patient?.name || "Unknown Patient"}
                        </div>
                      </td>

                      {}
                      {!isDoctorView && (
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-blue-500" />
                            {appointment.doctor?.name || "Unknown Doctor"}
                          </div>
                        </td>
                      )}

                      {}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {appointment.department || (
                          <span className="italic text-gray-400">
                            Not specified
                          </span>
                        )}
                      </td>

                      {}
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {appointment.reason ? (
                          <span title={appointment.reason}>
                            {appointment.reason}
                          </span>
                        ) : (
                          <span className="italic text-gray-400">
                            No reason given
                          </span>
                        )}
                      </td>

                      {}
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-500 hover:text-blue-600 transition"
                          title="View Appointment"
                          onClick={() => onView(appointment)}
                        >
                          <FiEye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-yellow-500 hover:text-yellow-600 transition"
                          title="Edit Appointment"
                          onClick={() => onEdit(appointment)}
                        >
                          <FiEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-600 transition"
                          title="Delete Appointment"
                          onClick={() => onDelete(appointment._id)}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isDoctorView ? 5 : 6}
                      className="text-center py-6 text-gray-400 italic text-sm"
                    >
                      {searchTerm
                        ? "No appointments match your search"
                        : "No appointments found"}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
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
  onNewAppointment: PropTypes.func.isRequired,
  isDoctorView: PropTypes.bool,
};

const AppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  appointmentData = null,
  isDoctorView = false,
}) => {
  const isEditMode = !!appointmentData;
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: new Date(),
    time: "",
    reason: "",
    status: "scheduled",
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const token = localStorage.getItem("authToken");
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour}:00`, `${hour}:30`);
  }

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsFetchingData(true);
        try {
          const doctorsRes = await axios.get(`${API_BASE_URL}/doctor`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const activeDoctors = doctorsRes.data.filter(
            (doctor) => doctor.status === "active"
          );
          setDoctors(activeDoctors);
          const patientsRes = await axios.get(`${API_BASE_URL}/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPatients(patientsRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Error loading required data for the form.");
        } finally {
          setIsFetchingData(false);
        }
      };

      fetchData();
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && appointmentData) {
        setFormData({
          patientId:
            appointmentData.patient?._id || appointmentData.patientId || "",
          doctorId:
            appointmentData.doctor?._id || appointmentData.doctorId || "",
          date: appointmentData.date
            ? new Date(appointmentData.date)
            : new Date(),
          time: appointmentData.time || "",
          reason: appointmentData.reason || "",
          status: appointmentData.status || "scheduled",
        });
      } else {
        setFormData({
          patientId: "",
          doctorId: isDoctorView ? getDoctorId() : "",
          date: new Date(),
          time: "",
          reason: "",
          status: "scheduled",
        });
      }
    }
  }, [isOpen, appointmentData, isEditMode, isDoctorView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const url =
        isEditMode && appointmentData._id
          ? `${API_BASE_URL}/appointments/${appointmentData._id}`
          : `${API_BASE_URL}/appointments`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...formData,
          date: formData.date.toISOString(), // Ensure date is sent as ISO string
        },
      });

      onSave(response.data);
      toast.success(
        `Appointment ${isEditMode ? "updated" : "created"} successfully`
      );
      onClose();
    } catch (err) {
      console.error("Appointment error:", err);
      toast.error(
        err.response?.data?.message ||
          `Error ${isEditMode ? "updating" : "creating"} appointment`
      );
    } finally {
      setIsLoading(false);
    }
  };
  function getDoctorId() {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        throw new Error("Doctor data not found in localStorage");
      }
      return userData.id;
    } catch (err) {
      console.error("Error getting doctor ID:", err);
      toast.error("Failed to load doctor information.");
      return null;
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Appointment" : "New Appointment"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Patient
          </label>
          <Select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            icon={<FiUser className="text-gray-400" />}
            disabled={isLoading || isFetchingData || patients.length === 0}
            options={patients.map((patient) => ({
              value: patient._id,
              label: patient.name,
            }))}
          />
          {patients.length === 0 && !isFetchingData && (
            <p className="text-sm text-red-500 mt-1">No patients available.</p>
          )}
          {isFetchingData && (
            <p className="text-sm text-gray-500 mt-1">Fetching patients...</p>
          )}
        </div>

        {}
        {!isDoctorView && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Doctor
            </label>
            <Select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              icon={<FiUser className="text-gray-400" />}
              disabled={isLoading || isFetchingData || doctors.length === 0}
              options={doctors.map((doctor) => ({
                value: doctor._id,
                label: `${doctor.name} (${doctor.specialization})`,
              }))}
            />
            {doctors.length === 0 && !isFetchingData && (
              <p className="text-sm text-red-500 mt-1">
                No active doctors available.
              </p>
            )}
            {isFetchingData && (
              <p className="text-sm text-gray-500 mt-1">Fetching doctors...</p>
            )}
          </div>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                minDate={new Date()} // Prevents selecting past dates
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dateFormat="MM/dd/yyyy" // Customize date format
                required
                disabled={isLoading}
              />
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <Select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              icon={<FiClock className="text-gray-400" />}
              disabled={isLoading}
              options={timeSlots.map((time) => ({
                value: time,
                label: time,
              }))}
            />
          </div>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason
          </label>
          <Input
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g., General check-up, Consultation for headache"
            disabled={isLoading}
            icon={<FiFileText className="text-gray-400" />}
          />
        </div>

        {}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={isLoading}
              options={[
                { value: "scheduled", label: "Scheduled" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "no-show", label: "No Show" },
              ]}
            />
          </div>
        )}

        {}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
            disabled={
              isLoading ||
              isFetchingData ||
              patients.length === 0 ||
              (!isDoctorView && doctors.length === 0)
            }
          >
            {isEditMode ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  appointmentData: PropTypes.object,
  isDoctorView: PropTypes.bool,
};

const AppointmentsPage = ({ isDoctorView = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const getDoctorId = useCallback(() => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id) {
      throw new Error(
        "Doctor ID not found in localStorage or user data is invalid."
      );
    }
    return userData.id;
  } catch (err) {
    console.error("Error getting doctor ID:", err);
    toast.error("Authentication error: Please log in again.");
    return null;
  }
}, []);

const fetchAppointments = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);
    const doctorId = getDoctorId();
    if (!doctorId) {
      setIsLoading(false);
      return;
    }
    const endpoint = `${API_BASE_URL}/appdoctors/doctor/${doctorId}`;

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAppointments(response.data);
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to fetch appointments.";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
}, [token, getDoctorId]); // Removed isDoctorView if it's not needed

useEffect(() => {
  fetchAppointments();
}, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    try {
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );

      await axios.patch(
        `${API_BASE_URL}/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated successfully.");
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.response?.data?.message || "Failed to update status.");
      fetchAppointments(); // Re-fetch to ensure data consistency
    }
  };

  const handleAddAppointment = (newAppointment) => {
    fetchAppointments(); // Re-fetch all appointments to include the new one
    setIsModalOpen(false);
  };

  const handleEditAppointment = (updatedAppointment) => {
    fetchAppointments(); // Re-fetch all appointments to reflect changes
    setIsModalOpen(false);
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAppointments();
      toast.success("Appointment deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.message || "Failed to delete appointment."
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <Button onClick={fetchAppointments} className="mt-6 px-6 py-3">
          <FiRefreshCcw className="inline mr-2" /> Retry Loading Appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AppointmentsTable
        appointments={appointments}
        onStatusUpdate={handleStatusChange}
        onEdit={(appointment) => {
          setSelectedAppointment(appointment);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteAppointment}
        onView={(appointment) => {
          toast.info(
            `Viewing appointment for ${appointment.patient?.name} with Dr. ${appointment.doctor?.name}`
          );
          console.log("View appointment details:", appointment);
        }}
        onNewAppointment={() => {
          setSelectedAppointment(null); // Clear any previous selection for new appointment
          setIsModalOpen(true);
        }}
        isDoctorView={isDoctorView}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedAppointment(null);
          setIsModalOpen(false);
        }}
        onSave={
          selectedAppointment ? handleEditAppointment : handleAddAppointment
        }
        appointmentData={selectedAppointment}
        isDoctorView={isDoctorView}
      />
    </div>
  );
};

AppointmentsPage.propTypes = {
  isDoctorView: PropTypes.bool,
};

export default AppointmentsPage;
