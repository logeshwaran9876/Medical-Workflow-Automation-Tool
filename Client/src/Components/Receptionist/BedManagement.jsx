import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiPhone,
  FiUser,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaBed,
  FaProcedures,
  FaWheelchair,
  FaClinicMedical,
  FaUserInjured,
} from "react-icons/fa";
import axios from "axios";
import BedCard from "./BedCard";
import AssignBedModal from "./AssignBedModal";
import AddBedModal from "./AddBedModal";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
   const token= localStorage.getItem("authToken");
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updateStats();
  }, [beds]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchBeds(), fetchWards(), fetchPatients()]);
    } catch (err) {
      console.error("Initial data loading error:", err);
      setError("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/beds", {
        params: {
          status: filter === "all" ? "" : filter,
          ward: wardFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeds(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Error fetching beds:", err);
      throw err;
    }
  };

  const fetchWards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/wards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWards(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Error fetching wards:", err);
      throw err;
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      throw err;
    }
  };

  const updateStats = () => {
    setStats({
      total: beds.length,
      available: beds.filter((b) => b?.status === "available").length,
      occupied: beds.filter((b) => b?.status === "occupied").length,
      maintenance: beds.filter((b) => b?.status === "maintenance").length,
    });
  };

  const handleAssignBed = (bed) => {
    setSelectedBed(bed);
    setShowAssignModal(true);
  };

  const handleDischarge = async (bedId) => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/beds/${bedId}/discharge`,{ headers: 
        {
          Authorization: `Bearer ${token}`
        }});
      await fetchBeds();
    } catch (err) {
      console.error("Error discharging patient:", err);
      setError(err.response?.data?.message || "Failed to discharge patient");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchBeds();
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const filteredBeds = beds.filter((bed) => {
    if (!bed) return false;

    const matchesSearch = searchQuery
      ? bed.bedNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6"
    >
      {}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm flex justify-between items-center"
        >
          <div className="flex items-center">
            <FaProcedures className="mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <FiX />
          </button>
        </motion.div>
      )}

      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaClinicMedical className="mr-2 text-indigo-600" />
            Bed Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hospital beds and patient assignments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Bed
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Beds"
          value={stats.total}
          icon={<FaBed className="text-2xl" />}
          color="indigo"
          trend={stats.total > 0 ? "up" : "none"}
        />
        <StatCard
          title="Available"
          value={stats.available}
          icon={<FaProcedures className="text-2xl" />}
          color="teal"
          trend={stats.available > 0 ? "up" : "down"}
        />
        <StatCard
          title="Occupied"
          value={stats.occupied}
          icon={<FaUserInjured className="text-2xl" />}
          color="amber"
          trend={stats.occupied > 0 ? "up" : "down"}
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          icon={<FaWheelchair className="text-2xl" />}
          color="purple"
          trend={stats.maintenance > 0 ? "up" : "none"}
        />
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search beds or patients..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <FiFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {showFilters ? (
                <FiChevronUp className="ml-1" />
              ) : (
                <FiChevronDown className="ml-1" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ward
                    </label>
                    <select
                      value={wardFilter}
                      onChange={(e) => setWardFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Wards</option>
                      {wards.map((ward) => (
                        <option key={ward._id} value={ward._id}>
                          {ward.name} ({ward.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredBeds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
          <FaBed className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No beds found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery || filter !== "all" || wardFilter
              ? "Try adjusting your search or filters"
              : "No beds available in the system"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBeds.map((bed) => (
            <BedCard
              key={bed._id}
              bed={bed}
              onAssign={() => handleAssignBed(bed)}
              onDischarge={() => handleDischarge(bed._id)}
            />
          ))}
        </motion.div>
      )}

      {}
      <AnimatePresence>
        {showAssignModal && (
          <AssignBedModal
            bed={selectedBed}
            patients={patients}
            onClose={() => setShowAssignModal(false)}
            onAssign={fetchBeds}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <AddBedModal
            wards={wards}
            onClose={() => setShowAddModal(false)}
            onAdd={fetchBeds}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-800",
    teal: "bg-teal-100 text-teal-800",
    amber: "bg-amber-100 text-amber-800",
    purple: "bg-purple-100 text-purple-800",
  };

  const trendIcons = {
    up: (
      <svg
        className="w-4 h-4 ml-1 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ),
    down: (
      <svg
        className="w-4 h-4 ml-1 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ),
    none: null,
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${colorClasses[color]} p-4 rounded-xl shadow-sm flex justify-between items-center`}
    >
      <div>
        <p className="text-sm font-medium">{title}</p>
        <div className="flex items-center">
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend !== "none" && trendIcons[trend]}
        </div>
      </div>
      <div className="p-2 rounded-lg bg-white bg-opacity-50">{icon}</div>
    </motion.div>
  );
};

export default BedManagement;
