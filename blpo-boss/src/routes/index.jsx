import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedroute';

// Public pages
import Landing        from '../pages/public/landing';
import Login          from '../pages/auth/login';
import Register       from '../pages/auth/register';
import Requirements from '../pages/public/requirements'

// Authenticated pages
import Dashboard      from '../pages/applicant/dashboard';

// Placeholder stubs (uncomment as pages are built)
// import OfficerQueue  from '../pages/officer/Queue';
// import AdminUsers    from '../pages/admin/Users';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"          element={<Landing />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/requirements" element={<Requirements />} />

      {/* Protected — applicant */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}



