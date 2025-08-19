"use client";

import { useEffect } from "react";
import { performanceMonitor } from "@/lib/performance";
import { registerServiceWorker } from "@/lib/service-worker";
import { preloadCriticalResources } from "@/lib/dynamic-imports";

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Performance monitoring provider component
 * Initializes performance tracking, Web Vitals monitoring, and service worker
 */
export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();

    // Mark app initialization
    performanceMonitor.mark("app-init");

    // Preload critical resources
    preloadCriticalResources();

    // Register service worker in production
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker().catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    }

    // Cleanup on unmount
    return () => {
      performanceMonitor.cleanup();
    };
  }, []);

  return <>{children}</>;
}
