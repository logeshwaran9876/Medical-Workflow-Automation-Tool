import { useState, useEffect } from "react";
import PatientsTable from "./PatientsTable";
import PatientModal from "./PatientModal";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import axios from "axios";
import SearchBar from "../ui/SearchBar";
import LoadingSpinner from "../ui/LoadingSpinner";

const API_BASE_URL = "http://localhost:5000/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    const token = localStorage.getItem("authToken");
    console.log(token)
    if (!token) {
      toast.error("No auth token found. Please login again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${API_BASE_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      console.error("Fetch Patients Error 👉", err);
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Failed to fetch patients.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.contact?.includes(searchTerm) ||
          patient.condition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (newPatient) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/patients`, newPatient);
      setPatients((prev) => [...prev, data]);
      toast.success("Patient added successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add patient");
    }
  };

  const handleEditPatient = async (updatedPatient) => {
    try {
      if (!updatedPatient._id) throw new Error("Patient ID missing");

      const { data } = await axios.put(
        `${API_BASE_URL}/patients/${updatedPatient._id}`,
        updatedPatient
      );

      setPatients((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      toast.success("Patient updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update patient");
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      toast.success("Patient deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/patients/${id}/status`,
        { status: newStatus }
      );
      setPatients((prev) => prev.map((p) => (p._id === id ? data : p)));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchPatients} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Patient Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search patients..."
          />
          <Button
            onClick={() => {
              setSelectedPatient(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            className="whitespace-nowrap"
          >
            + Add New Patient
          </Button>
        </div>
      </div>

      <PatientsTable
        patients={filteredPatients}
        onStatusChange={handleStatusChange}
        onEdit={(patient) => {
          setSelectedPatient(patient);
          setIsModalOpen(true);
        }}
        onDelete={handleDeletePatient}
      />

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedPatient(null);
          setIsModalOpen(false);
        }}
        onSave={selectedPatient ? handleEditPatient : handleAddPatient}
        patientData={selectedPatient}
      />
    </div>
  );
}
