import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { getErrors } from '../errors';
import FormErrors from './FormErrors';

// Props: onSwitch() -> tells the page to show the register form
export default function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user); // page redirects once user is set
    } catch (err) {
      setErrors(getErrors(err));
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <FormErrors errors={errors} />

      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <p className="auth-switch">
        No account yet?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Register
        </button>
      </p>
    </form>
  );
}
