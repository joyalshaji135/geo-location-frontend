// src/services/performanceService.ts
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  type: 'api' | 'render' | 'user_action' | 'resource';
  metadata?: Record<string, any>;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;
  private observers: ((metric: PerformanceMetric) => void)[] = [];

  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        type: 'user_action'
      });
    };
  }

  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Notify observers
    this.observers.forEach(observer => observer(metric));

    // Log slow operations
    if (metric.duration > 1000) { // More than 1 second
      console.warn(`Slow operation detected: ${metric.name} took ${metric.duration}ms`);
    }
  }

  measureApiCall<T>(apiName: string, apiCall: Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return apiCall.then(response => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: apiName,
        duration,
        timestamp: Date.now(),
        type: 'api',
        metadata: { status: 'success' }
      });
      return response;
    }).catch(error => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: apiName,
        duration,
        timestamp: Date.now(),
        type: 'api',
        metadata: { status: 'error', error: error.message }
      });
      throw error;
    });
  }

  measureRender(componentName: string, renderCount: number = 1): void {
    const duration = performance.now();
    this.recordMetric({
      name: `${componentName}_render`,
      duration,
      timestamp: Date.now(),
      type: 'render',
      metadata: { renderCount }
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageDuration(metricName: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === metricName);
    if (relevantMetrics.length === 0) return 0;
    
    return relevantMetrics.reduce((sum, metric) => sum + metric.duration, 0) / relevantMetrics.length;
  }

  subscribe(callback: (metric: PerformanceMetric) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      this.observers = this.observers.filter(obs => obs !== callback);
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceService = new PerformanceService();