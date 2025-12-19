// Layout principal da aplicação
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authStore from '../store/authStore';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStore((state) => state.user);
  const logout = authStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-brand">
              💰 Gestão Financeira
            </Link>
            <div className="nav-links">
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Dashboard
              </Link>
              <Link to="/transactions" className={isActive('/transactions') ? 'active' : ''}>
                Transações
              </Link>
              <Link to="/categories" className={isActive('/categories') ? 'active' : ''}>
                Categorias
              </Link>
              <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>
                Relatórios
              </Link>
              <div className="nav-user">
                <span>{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

