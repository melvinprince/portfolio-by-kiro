"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { analytics } from "./analytics-provider";
import { features } from "@/lib/env";

export function PerformanceMonitor() {
  useEffect(() => {
    if (!features.performanceMonitoring) return;

    // Track Core Web Vitals
    onCLS((metric) => {
      analytics.track("CLS", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onFCP((metric) => {
      analytics.track("FCP", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onINP((metric) => {
      analytics.track("INP", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onLCP((metric) => {
      analytics.track("LCP", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onTTFB((metric) => {
      analytics.track("TTFB", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    // Track navigation timing
    if (typeof window !== "undefined" && window.performance) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        analytics.track("Navigation Timing", {
          domContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          firstByte: navigation.responseStart - navigation.requestStart,
        });
      }
    }

    // Track resource loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          const resource = entry as PerformanceResourceTiming;

          // Track slow resources
          if (resource.duration > 1000) {
            analytics.track("Slow Resource", {
              name: resource.name,
              duration: resource.duration,
              size: resource.transferSize,
              type: resource.initiatorType,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
