import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../forms.css';

export default function LoginRegister() {
  const { user, checking } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  if (checking) return <p>Checking session...</p>;

  // already logged in (or just logged in) -> go to the gallery
  if (user) return <Navigate to="/gallery" replace />;

  return (
    <div className="auth-card">
      {mode === 'login' ? (
        <LoginForm onSwitch={() => setMode('register')} />
      ) : (
        <RegisterForm onSwitch={() => setMode('login')} />
      )}
    </div>
  );
}
