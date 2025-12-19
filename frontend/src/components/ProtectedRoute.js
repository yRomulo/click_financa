// Componente para proteger rotas que exigem autenticação
import { Navigate } from 'react-router-dom';
import authStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const token = authStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

