"use client";

/**
 * Performance monitoring utilities for Core Web Vitals tracking
 */

// Types for performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
  id?: string;
}

export interface WebVitalsMetric extends PerformanceMetric {
  delta: number;
  entries?: PerformanceEntry[];
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

/**
 * Get performance rating based on metric value and thresholds
 */
function getRating(
  metricName: keyof typeof THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (this.isInitialized || typeof window === "undefined") return;

    this.initWebVitals();
    this.initResourceTiming();
    this.initNavigationTiming();
    this.isInitialized = true;
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initWebVitals() {
    // Import web-vitals dynamically to reduce bundle size
    import("web-vitals")
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS((metric) =>
          this.handleMetric({ ...metric, timestamp: Date.now() })
        );
        onFCP((metric) =>
          this.handleMetric({ ...metric, timestamp: Date.now() })
        );
        onLCP((metric) =>
          this.handleMetric({ ...metric, timestamp: Date.now() })
        );
        onTTFB((metric) =>
          this.handleMetric({ ...metric, timestamp: Date.now() })
        );
        onINP((metric) =>
          this.handleMetric({ ...metric, timestamp: Date.now() })
        );
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });
  }

  /**
   * Handle Web Vitals metric
   */
  private handleMetric(metric: WebVitalsMetric) {
    const rating = getRating(
      metric.name as keyof typeof THRESHOLDS,
      metric.value
    );

    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      id: metric.id,
    };

    this.metrics.set(metric.name, performanceMetric);
    this.reportMetric(performanceMetric);
  }

  /**
   * Initialize resource timing monitoring
   */
  private initResourceTiming() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          this.trackResourceTiming(entry as PerformanceResourceTiming);
        }
      }
    });

    observer.observe({ entryTypes: ["resource"] });
    this.observers.push(observer);
  }

  /**
   * Initialize navigation timing monitoring
   */
  private initNavigationTiming() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          this.trackNavigationTiming(entry as PerformanceNavigationTiming);
        }
      }
    });

    observer.observe({ entryTypes: ["navigation"] });
    this.observers.push(observer);
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(entry: PerformanceResourceTiming) {
    // Track slow resources
    if (entry.duration > 1000) {
      const metric: PerformanceMetric = {
        name: "slow-resource",
        value: entry.duration,
        rating: entry.duration > 3000 ? "poor" : "needs-improvement",
        timestamp: Date.now(),
      };

      this.reportMetric(metric, {
        url: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize,
      });
    }
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const domContentLoaded =
      entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const loadComplete = entry.loadEventEnd - entry.loadEventStart;

    if (domContentLoaded > 0) {
      const metric: PerformanceMetric = {
        name: "dom-content-loaded",
        value: domContentLoaded,
        rating:
          domContentLoaded > 2000
            ? "poor"
            : domContentLoaded > 1000
            ? "needs-improvement"
            : "good",
        timestamp: Date.now(),
      };
      this.reportMetric(metric);
    }

    if (loadComplete > 0) {
      const metric: PerformanceMetric = {
        name: "load-complete",
        value: loadComplete,
        rating:
          loadComplete > 3000
            ? "poor"
            : loadComplete > 1500
            ? "needs-improvement"
            : "good",
        timestamp: Date.now(),
      };
      this.reportMetric(metric);
    }
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(
    metric: PerformanceMetric,
    additionalData?: Record<string, any>
  ) {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        ...additionalData,
      });
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      this.sendToAnalytics(metric, additionalData);
    }
  }

  /**
   * Send metrics to analytics service
   */
  private sendToAnalytics(
    metric: PerformanceMetric,
    additionalData?: Record<string, any>
  ) {
    // Vercel Analytics
    if (typeof window !== "undefined" && "va" in window) {
      (window as any).va("track", "Performance", {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        ...additionalData,
      });
    }

    // Google Analytics 4
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating,
        },
        ...additionalData,
      });
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "performance",
          metric,
          additionalData,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch((error) => {
        console.warn("Failed to send performance metric:", error);
      });
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }

  /**
   * Mark custom performance timing
   */
  mark(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(name);
    }
  }

  /**
   * Measure custom performance timing
   */
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        const measure = endMark
          ? performance.measure(name, startMark, endMark)
          : performance.measure(name, startMark);

        const metric: PerformanceMetric = {
          name: `custom-${name}`,
          value: measure.duration,
          rating:
            measure.duration > 1000
              ? "poor"
              : measure.duration > 500
              ? "needs-improvement"
              : "good",
          timestamp: Date.now(),
        };

        this.reportMetric(metric);
        return measure.duration;
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
    return 0;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  return {
    init: monitor.init.bind(monitor),
    mark: monitor.mark.bind(monitor),
    measure: monitor.measure.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getMetric: monitor.getMetric.bind(monitor),
    clearMetrics: monitor.clearMetrics.bind(monitor),
  };
}
