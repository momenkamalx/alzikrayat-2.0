import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import usePageTitle from '../usePageTitle';
import { formatLastLogin } from '../format';
import '../forms.css';

// when this browser last logged in (saved by AuthContext.login)
const readLastLogin = () => {
  try {
    return localStorage.getItem('lastLogin');
  } catch {
    return null;
  }
};

export default function LoginRegister() {
  const { user, checking } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  usePageTitle(mode === 'login' ? 'Login' : 'Register');

  if (checking) return <p>Checking session...</p>;

  // already logged in (or just logged in) -> go to the gallery
  if (user) return <Navigate to="/gallery" replace />;

  const lastLogin = mode === 'login' ? readLastLogin() : null;

  return (
    <div className="auth-card">
      {mode === 'login' ? (
        <LoginForm onSwitch={() => setMode('register')} />
      ) : (
        <RegisterForm onSwitch={() => setMode('login')} />
      )}

      {lastLogin && (
        <p className="last-login">
          (last login from this computer was {formatLastLogin(lastLogin)})
        </p>
      )}
    </div>
  );
}
