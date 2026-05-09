import { useState, useEffect } from 'react';
import { getProviderServices, getProviderBookings, updateBookingStatus, createService, deleteService, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const STATUS_COLOR = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' };

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [form, setForm] = useState({ title: '', category_id: '', price: '', location: '', description: '' });
  const [msg, setMsg] = useState('');

  const reload = () => {
    getProviderServices().then(r => setServices(r.data));
    getProviderBookings().then(r => setBookings(r.data));
  };

  useEffect(() => {
    reload();
    getCategories().then(r => setCategories(r.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createService(form);
      setMsg('✅ Service listed!');
      setForm({ title: '', category_id: '', price: '', location: '', description: '' });
      reload();
    } catch { setMsg('❌ Failed to create service.'); }
  };

  const handleStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) { await deleteService(id); reload(); }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🔧 Provider Dashboard</h1>
        <p>Welcome, <strong>{user?.name}</strong></p>
      </div>

      <div className="tabs">
        {['bookings', 'services', 'add'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'bookings' ? '📅 Bookings' : t === 'services' ? '📋 My Services' : '➕ Add Service'}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="bookings-list">
          {bookings.length === 0 ? <div className="empty-state">No bookings received yet.</div> : bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-info">
                <h3>{b.service_title}</h3>
                <p>Customer: {b.customer_name} · {b.customer_phone}</p>
                <p>Date: {b.scheduled_date ? new Date(b.scheduled_date).toLocaleDateString() : 'Flexible'}</p>
                {b.note && <p>Note: {b.note}</p>}
              </div>
              <div className="booking-actions">
                <div className="booking-status" style={{ background: STATUS_COLOR[b.status] + '20', color: STATUS_COLOR[b.status] }}>
                  {b.status.toUpperCase()}
                </div>
                <select onChange={e => handleStatus(b.id, e.target.value)} defaultValue="">
                  <option value="" disabled>Update</option>
                  {['pending','confirmed','completed','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'services' && (
        <div className="services-list">
          {services.length === 0 ? <div className="empty-state">No services listed yet.</div> : services.map(s => (
            <div key={s.id} className="service-row">
              <div>
                <strong>{s.title}</strong>
                <span className="row-cat">{s.category_name}</span>
              </div>
              <div className="row-right">
                <span className="row-price">₹{s.price}</span>
                <button className="del-btn" onClick={() => handleDelete(s.id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'add' && (
        <form className="add-service-form" onSubmit={handleCreate}>
          <h2>List a New Service</h2>
          {msg && <div className="form-msg">{msg}</div>}
          <input placeholder="Service title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input type="number" placeholder="Price (₹)" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Your location / city" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <textarea placeholder="Describe your service..." rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type="submit">List Service</button>
        </form>
      )}
    </div>
  );
}
