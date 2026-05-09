import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getServices } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
    getServices().then(r => setFeatured(r.data.slice(0, 6)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Trusted Local <span className="highlight">Services</span> Near You</h1>
          <p>Book verified plumbers, electricians, tutors, cleaners and more — all in one place.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-chip"
              onClick={() => navigate(`/services?category=${cat.id}`)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      {featured.length > 0 && (
        <section className="section">
          <h2 className="section-title">Featured Services</h2>
          <div className="services-grid">
            {featured.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="center">
            <button className="view-all" onClick={() => navigate('/services')}>View All Services →</button>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {[
            { icon: '🔍', title: 'Search', desc: 'Find the service you need in your area' },
            { icon: '📅', title: 'Book', desc: 'Choose a date and confirm your booking' },
            { icon: '✅', title: 'Done', desc: 'Provider arrives and gets the job done' },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
