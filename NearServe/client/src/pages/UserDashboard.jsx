import { useState, useEffect } from 'react';
import { getUserBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const STATUS_COLOR = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' };

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => { getUserBookings().then(r => setBookings(r.data)); }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>👤 My Dashboard</h1>
        <p>Welcome back, <strong>{user?.name}</strong></p>
      </div>

      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="empty-state">No bookings yet. <a href="/services">Browse services →</a></div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-info">
                <h3>{b.service_title}</h3>
                <p>Provider: {b.provider_name}</p>
                <p>Date: {b.scheduled_date ? new Date(b.scheduled_date).toLocaleDateString() : 'Not set'}</p>
                <p>Amount: <strong>₹{b.price}</strong></p>
                {b.note && <p>Note: {b.note}</p>}
              </div>
              <div className="booking-status" style={{ background: STATUS_COLOR[b.status] + '20', color: STATUS_COLOR[b.status] }}>
                {b.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
