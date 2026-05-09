import { Link } from 'react-router-dom';
import './ServiceCard.css';

export default function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="card-category">
        <span>{service.category_icon}</span> {service.category_name}
      </div>
      <h3 className="card-title">{service.title}</h3>
      <p className="card-provider">👤 {service.provider_name}</p>
      {service.location && <p className="card-location">📍 {service.location}</p>}
      <p className="card-desc">{service.description?.slice(0, 90)}{service.description?.length > 90 ? '...' : ''}</p>
      <div className="card-footer">
        <div>
          <span className="card-price">₹{service.price}</span>
          <span className="card-rating"> ⭐ {Number(service.avg_rating).toFixed(1)} ({service.review_count})</span>
        </div>
        <Link to={`/services/${service.id}`} className="card-btn">Book Now</Link>
      </div>
    </div>
  );
}
