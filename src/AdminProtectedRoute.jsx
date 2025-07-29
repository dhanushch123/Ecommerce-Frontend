import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const role = localStorage.getItem('role');

  if (role !== 'ADMIN') {
    alert('You are not authorized to access this page.');
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminProtectedRoute;
