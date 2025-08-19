"use client";

import { useEffect } from "react";
import { clientEnv, features } from "@/lib/env";

// Plausible analytics
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, any> }
    ) => void;
  }
}

// Vercel Analytics
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize Plausible if configured
    if (features.analytics && clientEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      const script = document.createElement("script");
      script.defer = true;
      script.src = "https://plausible.io/js/script.js";
      script.setAttribute(
        "data-domain",
        clientEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
      );
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <>
      {children}
      {features.analytics && <VercelAnalytics />}
      {features.performanceMonitoring && <SpeedInsights />}
    </>
  );
}

// Analytics tracking functions
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (!features.analytics) return;

    // Plausible tracking
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible(event, { props: properties });
    }

    // Vercel Analytics tracking
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", event, properties);
    }
  },

  page: (_url: string, _title?: string) => {
    if (!features.analytics) return;

    // Plausible automatically tracks page views
    // Vercel Analytics automatically tracks page views
  },

  identify: (_userId: string, _traits?: Record<string, any>) => {
    if (!features.analytics) return;

    // Most privacy-focused analytics don't support user identification
    // This is here for potential future use
  },
};

// Custom hooks for analytics
export function useAnalytics() {
  return {
    track: analytics.track,
    page: analytics.page,
    identify: analytics.identify,
  };
}
