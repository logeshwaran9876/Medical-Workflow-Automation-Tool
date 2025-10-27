import ReceptionistStatsCard from "./ReceptionistStatsCard";
import { FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
import { FaProcedures, FaBed } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState([]);
  
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments" ,{headers: { Authorization: `Bearer ${token}` }});
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments 😵", err);
      }
    };

    fetchAppointments();
  }, []);

  const stats = [
    {
      title: "Today's Appointments",
      value: "24",
      icon: <FiCalendar />,
      color: "blue",
      trend: { value: 12, label: "vs yesterday" },
    },
    {
      title: "Registered Patients",
      value: "186",
      icon: <FiUsers />,
      color: "teal",
      trend: { value: 5, label: "this week" },
    },
    {
      title: "Beds Occupied",
      value: "32/50",
      icon: <FaBed />,
      color: "purple",
    },
    {
      title: "Pending Bills",
      value: "₹12,450",
      icon: <FiDollarSign />,
      color: "amber",
    },
    
  ];

  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <ReceptionistStatsCard key={index} {...stat} />
        ))}
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              item.status === "completed"
                ? "bg-green-100 text-green-800"
                : item.status === "scheduled"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No recent appointments 💤
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3 hover:bg-blue-50 transition-colors">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <FiUsers className="text-xl" />
          </div>
          <span className="font-medium">Register New Patient</span>
        </button>

        <button className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3 hover:bg-green-50 transition-colors">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <FiCalendar className="text-xl" />
          </div>
          <span className="font-medium">Book Appointment</span>
        </button>

        <button className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3 hover:bg-purple-50 transition-colors">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <FaProcedures className="text-xl" />
          </div>
          <span className="font-medium">Check Bed Availability</span>
        </button>
      </div>
    </div>
  );
}
