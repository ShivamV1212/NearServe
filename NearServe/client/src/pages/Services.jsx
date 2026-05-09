import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices, getCategories } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import './Services.css';

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => { getCategories().then(r => setCategories(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    getServices({ search, category })
      .then(r => setServices(r.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Browse Services</h1>
        <input
          className="search-input"
          placeholder="Search services..."
          defaultValue={search}
          onChange={e => setFilter('search', e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${!category ? 'active' : ''}`}
          onClick={() => setFilter('category', '')}
        >All</button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`filter-btn ${category == c.id ? 'active' : ''}`}
            onClick={() => setFilter('category', c.id)}
          >{c.icon} {c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="empty">No services found. Try a different search.</div>
      ) : (
        <div className="services-grid">
          {services.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </div>
  );
}
