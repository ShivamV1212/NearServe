import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '', location: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await register(form);
      loginUser(res.data.user, res.data.token);
      navigate(res.data.user.role === 'provider' ? '/dashboard/provider' : '/dashboard/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-sub">Join NearServe as a user or service provider</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full name" required onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email address" required onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password (min 6 chars)" required onChange={e => setForm({ ...form, password: e.target.value })} />
          <input type="text" placeholder="Phone number" onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input type="text" placeholder="Your city / location" onChange={e => setForm({ ...form, location: e.target.value })} />
          <div className="role-selector">
            <label className={`role-opt ${form.role === 'user' ? 'selected' : ''}`}>
              <input type="radio" value="user" checked={form.role === 'user'} onChange={() => setForm({ ...form, role: 'user' })} />
              👤 I need services
            </label>
            <label className={`role-opt ${form.role === 'provider' ? 'selected' : ''}`}>
              <input type="radio" value="provider" checked={form.role === 'provider'} onChange={() => setForm({ ...form, role: 'provider' })} />
              🔧 I provide services
            </label>
          </div>
          <button type="submit">Create Account</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
