import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.token);
      navigate(res.data.user.role === 'provider' ? '/dashboard/provider' : '/dashboard/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-sub">Login to your NearServe account</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email address" required
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required
            onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit">Login</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign Up</Link></p>
      </div>
    </div>
  );
}
