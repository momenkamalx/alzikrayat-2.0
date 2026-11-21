import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">Alzikrayat</Link>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        {user && <NavLink to="/upload">Add Photo</NavLink>}
      </nav>

      <div className="nav-user">
        {user ? (
          <>
            <span>Hi {user.firstName}</span>
            <button type="button" className="btn btn-small" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-small">Please Login</Link>
        )}
      </div>
    </header>
  );
}
