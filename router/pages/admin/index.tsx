import { Navigate } from 'react-router-dom';

export default function AdminIndexRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}
