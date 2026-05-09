import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, createBooking, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getServiceById(id).then(r => setService(r.data));
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await createBooking({ service_id: id, scheduled_date: date, note });
      setMsg('✅ Booking confirmed! Check your dashboard.');
    } catch { setMsg('❌ Booking failed. Please try again.'); }
  };

  const handleReview = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addReview({ service_id: id, rating, comment });
      setMsg('✅ Review submitted!');
      getServiceById(id).then(r => setService(r.data));
    } catch { setMsg('❌ Review failed.'); }
  };

  if (!service) return <div className="loading-full">Loading...</div>;

  return (
    <div className="detail-page">
      <div className="detail-main">
        <div className="detail-badge">{service.category_icon} {service.category_name}</div>
        <h1>{service.title}</h1>
        <p className="detail-provider">👤 {service.provider_name} · 📍 {service.location}</p>
        <div className="detail-rating">⭐ {Number(service.avg_rating).toFixed(1)} ({service.review_count} reviews)</div>
        <p className="detail-desc">{service.description}</p>

        {/* Reviews */}
        {service.reviews?.length > 0 && (
          <div className="reviews">
            <h3>Reviews</h3>
            {service.reviews.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-top">
                  <strong>{r.reviewer_name}</strong>
                  <span>{'⭐'.repeat(r.rating)}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leave review */}
        {user && user.role === 'user' && (
          <div className="review-form">
            <h3>Leave a Review</h3>
            <select value={rating} onChange={e => setRating(e.target.value)}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
            </select>
            <textarea placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} />
            <button onClick={handleReview}>Submit Review</button>
          </div>
        )}
      </div>

      {/* Booking Panel */}
      <div className="booking-panel">
        <div className="price-tag">₹{service.price}</div>
        <p className="price-label">per service</p>
        <div className="booking-form">
          <label>Preferred Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          <label>Note (optional)</label>
          <textarea placeholder="Describe your requirement..." value={note} onChange={e => setNote(e.target.value)} />
          <button className="book-btn" onClick={handleBook}>
            {user ? 'Confirm Booking' : 'Login to Book'}
          </button>
          {msg && <p className="booking-msg">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
