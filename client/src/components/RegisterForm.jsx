import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { getErrors } from '../errors';
import FormErrors from './FormErrors';

// Props: onSwitch() -> tells the page to show the login form
export default function RegisterForm({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // one handler for every input: uses the input's name attribute
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (form.password !== form.confirm) {
      setErrors(['Passwords do not match']);
      return;
    }

    setLoading(true);
    try {
      const { firstName, lastName, email, password } = form;
      await api.post('/auth/register', { firstName, lastName, email, password });
      // account created -> log in straight away
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user); // page redirects once user is set
    } catch (err) {
      setErrors(getErrors(err));
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create account</h2>
      <FormErrors errors={errors} />

      <label htmlFor="reg-first">First name</label>
      <input id="reg-first" name="firstName" value={form.firstName} onChange={handleChange} required maxLength={50} />

      <label htmlFor="reg-last">Last name</label>
      <input id="reg-last" name="lastName" value={form.lastName} onChange={handleChange} required maxLength={50} />

      <label htmlFor="reg-email">Email</label>
      <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />

      <label htmlFor="reg-password">Password (min 8 characters)</label>
      <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" />

      <label htmlFor="reg-confirm">Confirm password</label>
      <input id="reg-confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} required autoComplete="new-password" />

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  );
}
