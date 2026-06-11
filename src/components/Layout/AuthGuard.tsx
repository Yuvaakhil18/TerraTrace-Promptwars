import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';
import Spinner from '../ui/Spinner';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner label="Checking authentication..." />
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to auth page and save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
