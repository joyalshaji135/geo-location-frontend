// src/components/PerformanceMonitor.tsx
import React, { useState, useEffect } from 'react';
import { performanceService } from '../services/performanceService';
import { cacheService } from '../services/cacheService';
import './PerformanceMonitor.css';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    const subscription = performanceService.subscribe((metric) => {
      setMetrics(prev => [metric, ...prev.slice(0, 19)]); // Keep last 20 metrics
    });

    // Update cache size every 5 seconds
    const interval = setInterval(() => {
      setCacheSize(cacheService.getSize());
    }, 5000);

    return () => {
      subscription();
      clearInterval(interval);
    };
  }, []);

  const getPerformanceColor = (duration: number): string => {
    if (duration < 100) return '#10b981'; // Green
    if (duration < 500) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const clearMetrics = () => {
    performanceService.clearMetrics();
    setMetrics([]);
  };

  const clearCache = () => {
    cacheService.clear();
    setCacheSize(0);
  };

  if (!isVisible) {
    return (
      <button 
        className="performance-monitor-toggle"
        onClick={() => setIsVisible(true)}
        title="Show Performance Monitor"
      >
        ⚡
      </button>
    );
  }

  return (
    <div className="performance-monitor">
      <div className="performance-header">
        <h3>Performance Monitor</h3>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>

      <div className="performance-stats">
        <div className="stat">
          <span className="stat-label">Cache Size:</span>
          <span className="stat-value">{cacheSize} items</span>
        </div>
        <div className="stat">
          <span className="stat-label">Metrics:</span>
          <span className="stat-value">{metrics.length} recorded</span>
        </div>
      </div>

      <div className="performance-actions">
        <button onClick={clearMetrics} className="btn-secondary">
          Clear Metrics
        </button>
        <button onClick={clearCache} className="btn-secondary">
          Clear Cache
        </button>
      </div>

      <div className="metrics-list">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-header">
              <span className="metric-name">{metric.name}</span>
              <span 
                className="metric-duration"
                style={{ color: getPerformanceColor(metric.duration) }}
              >
                {metric.duration.toFixed(2)}ms
              </span>
            </div>
            <div className="metric-meta">
              <span className="metric-type">{metric.type}</span>
              <span className="metric-time">
                {new Date(metric.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMonitor;