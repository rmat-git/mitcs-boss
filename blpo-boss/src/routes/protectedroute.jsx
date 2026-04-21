import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';

/**
 * Wraps routes that require authentication.
 * Redirects to /login and preserves the originally requested path
 * so the user is sent back after a successful login.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}