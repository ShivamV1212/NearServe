import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">📍</span> NearServe
      </Link>
      <div className="navbar-links">
        <Link to="/services">Browse Services</Link>
        {!user ? (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to={user.role === 'provider' ? '/dashboard/provider' : '/dashboard/user'}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
