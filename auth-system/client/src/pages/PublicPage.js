import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/public.css';

const PublicPage = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTitles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/titles');
        setTitles(res.data);
      } catch (err) {
        console.error('Failed to fetch public titles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTitles();
  }, []);

  return (
    <div className="public-page">
      <header className="public-header">
        <h1>Task Manager - Public Page</h1>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
      </header>

      <div className="public-content">
        <h2>Public Tasks</h2>
        
        {loading ? (
          <div className="loading-state">Loading public tasks...</div>
        ) : titles.length === 0 ? (
          <div className="empty-state">
            No public tasks available.
          </div>
        ) : (
          <ul className="public-task-list">
            {titles.map(title => (
              <li key={title.id} className="public-task-item">
                <span className="task-name">{title.name}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="cta-section">
          <h3>Want to create your own tasks?</h3>
          <p>Sign up or log in to start managing your own task list!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button register">Sign Up</Link>
            <Link to="/login" className="cta-button login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;