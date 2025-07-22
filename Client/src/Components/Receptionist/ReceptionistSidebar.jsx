import { NavLink } from "react-router-dom";
import { 
  FiCalendar, FiUser, FiHome, 
  FiDollarSign, FiClipboard, FiPieChart 
} from "react-icons/fi";
import { 
  FaSignOutAlt, FaBed, FaBoxes, FaClinicMedical,
  FaUserMd, FaFilePrescription 
} from "react-icons/fa";
import { motion } from "framer-motion";

const navItems = [
  { icon: <FiHome />, label: "Dashboard", path: "/receptionist" },
  { icon: <FiUser />, label: "Patients", path: "/receptionist/patients" },
  { icon: <FiCalendar />, label: "Appointments", path: "/receptionist/appointments" },
  { icon: <FaBed />, label: "Bed Management", path: "/receptionist/beds" },
  { icon: <FiDollarSign />, label: "Billing", path: "/receptionist/billing" },
  { icon: <FiPieChart />, label: "Reports", path: "/receptionist/reports" },
];

export default function ReceptionistSidebar({ closeSidebar }) {
  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-72 bg-gradient-to-b from-indigo-800 to-purple-900 border-r border-indigo-700 flex flex-col shadow-xl h-full"
    >
      {/* Logo */}
      <div className="p-5 border-b border-indigo-700">
        <div className="flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <FaClinicMedical className="text-3xl text-indigo-600" />
          </div>
          <h1 className="ml-3 text-2xl font-bold text-white">MediCare+</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                end={item.path === "/receptionist"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/20 text-white font-semibold shadow-md backdrop-blur-sm"
                      : "text-indigo-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-indigo-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center w-full p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => console.log("Logging out...")}
        >
          <FaSignOutAlt className="text-xl mr-3" />
          <span className="text-lg">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}