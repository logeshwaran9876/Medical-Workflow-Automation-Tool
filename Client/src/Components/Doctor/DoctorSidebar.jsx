
import { NavLink, useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiFileText } from "react-icons/fi";
import { RiChatFollowUpLine } from "react-icons/ri";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import DoctorLogo from "./ui/DoctorLogo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const navItems = [
  { icon: <FaTachometerAlt />, label: "Dashboard", path: "/doctor" },
  { icon: <FiCalendar />, label: "Appointments", path: "/doctor/appointments" },
  { icon: <FiUser />, label: "Patients", path: "/doctor/patients" },
  {
    icon: <FiFileText />,
    label: "Prescriptions",
    path: "/doctor/prescriptions",
  },
  {
    icon: <RiChatFollowUpLine />,
    label: "FollowUps",
    path: "/doctor/followups",
  },
];

export default function DoctorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("You have been logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white border-r border-teal-100 flex flex-col shadow-lg">
      {}
      <div className="p-5 border-b border-teal-100">
        <DoctorLogo />
      </div>

      {}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/doctor"}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-100 text-teal-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {}
      <div className="p-4 border-t border-teal-100">
        <button
          className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-xl mr-3 group-hover:animate-pulse" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </aside>
  );
}