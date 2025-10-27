
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiUser, FiUsers,
  FiFileText, FiSettings, FiLogOut 
} from 'react-icons/fi';
import Logo from './ui/logo';

const navItems = [
  { icon: <FiHome />, label: 'Dashboard', path: '/' },
  { icon: <FiCalendar />, label: 'Appointments', path: '/appointments' },
  { icon: <FiUser />, label: 'Doctors', path: '/doctors' },
  { icon: <FiUsers />, label: 'Patients', path: '/patients' },
  { icon: <FiFileText />, label: 'Reports', path: '/reports' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}