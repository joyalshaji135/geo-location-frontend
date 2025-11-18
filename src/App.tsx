// Updated App.tsx
import React, { useEffect, useState } from 'react';
import LocationPhoneForm from './components/LocationPhoneForm';
import PerformanceMonitor from './components/PerformanceMonitor';
import { performanceService } from './services/performanceService';
import './App.css';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endTimer = performanceService.startTimer('app_initial_load');
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      endTimer();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Generate random particles for background
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      );
    }
    return particles;
  };

  if (loading) {
    return (
      <div className="App">
        <div className="App-loading">
          <div className="loading-spinner-large"></div>
          <div className="loading-text">Loading Application...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="particles">
        {renderParticles()}
      </div>
      
      <header className="App-header">
        <h1 className="App-title">Global Contact Form</h1>
        <p className="App-subtitle">
          Enter your location details and phone number with our intuitive form. 
          Features real-time validation, country flags, and seamless user experience.
        </p>
      </header>

      <main className="App-content">
        <LocationPhoneForm />
      </main>

      <section className="App-features">
        <div className="feature-card" style={{ animationDelay: '0.1s' }}>
          <span className="feature-icon">🌍</span>
          <h3 className="feature-title">Global Coverage</h3>
          <p className="feature-description">
            Supports countries worldwide with automatic state and district loading
          </p>
        </div>
        
        <div className="feature-card" style={{ animationDelay: '0.2s' }}>
          <span className="feature-icon">⚡</span>
          <h3 className="feature-title">Fast & Responsive</h3>
          <p className="feature-description">
            Optimized performance with smart caching and quick loading times
          </p>
        </div>
        
        <div className="feature-card" style={{ animationDelay: '0.3s' }}>
          <span className="feature-icon">🎯</span>
          <h3 className="feature-title">Smart Caching</h3>
          <p className="feature-description">
            Intelligent caching system for faster repeated access and better performance
          </p>
        </div>
      </section>

      <footer className="App-footer">
        <p>© 2024 Global Contact Form. All rights reserved.</p>
        <p>Built with React & TypeScript</p>
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#contact" className="footer-link">Contact Support</a>
        </div>
      </footer>

      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
};

export default App;