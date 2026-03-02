import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ManagerLayout from './ManagerLayout';
import TechnicianLayout from './TechnicianLayout';

export default function AppLayout() {
  const { user, isAuthenticated, login } = useAuth();

  // Auto-login as manager if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      login('demo@architech.ai', 'demo', 'technician');
    }
  }, [isAuthenticated, login]);

  if (!isAuthenticated) return null;

  return <TechnicianLayout />;
}
