import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ManagerLayout from './ManagerLayout';
import TechnicianLayout from './TechnicianLayout';

export default function AppLayout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'technician') return <TechnicianLayout />;
  return <ManagerLayout />;
}
