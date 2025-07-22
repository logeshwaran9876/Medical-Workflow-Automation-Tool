// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

// Make sure you're using default export
const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// This must be a default export
export default ProtectedRoute;