
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;