"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

/**
 * Dynamic import utilities for performance optimization
 */

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Error boundary for dynamic imports (currently unused but kept for future use)
// const ErrorFallback = ({ error }: { error: Error }) => (
//   <div className="flex items-center justify-center p-8 text-center">
//     <div>
//       <p className="text-destructive mb-2">Failed to load component</p>
//       <p className="text-sm text-muted-foreground">{error.message}</p>
//     </div>
//   </div>
// );

/**
 * Create a dynamic import with loading and error states
 */
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType;
    error?: ComponentType<{ error: Error }>;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading
      ? () => {
          const LoadingComponent = options.loading!;
          return <LoadingComponent />;
        }
      : () => <LoadingSpinner />,
    ssr: options.ssr ?? true,
  });
}

/**
 * Dynamic imports for heavy components
 */

// Heavy interactive components that exist
export const DynamicContactForm = createDynamicImport(() =>
  import("@/components/contact/contact-form").then((mod) => ({
    default: mod.ContactForm,
  }))
);

/**
 * Lazy load GSAP modules
 */
export async function loadGSAP() {
  if (typeof window === "undefined") return null;

  try {
    const [gsapModule, scrollTriggerModule] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    const { gsap } = gsapModule;
    const { ScrollTrigger } = scrollTriggerModule;

    gsap.registerPlugin(ScrollTrigger);

    return { gsap, ScrollTrigger };
  } catch (error) {
    console.warn("Failed to load GSAP:", error);
    return null;
  }
}

/**
 * Lazy load Framer Motion components
 */
export async function loadFramerMotion() {
  if (typeof window === "undefined") return null;

  try {
    const motionModule = await import("framer-motion");
    return motionModule;
  } catch (error) {
    console.warn("Failed to load Framer Motion:", error);
    return null;
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === "undefined") return;

  // Preload critical images
  const criticalImages = ["/hero-bg.jpg", "/profile.jpg"];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = ["/fonts/inter-var.woff2"];

  criticalFonts.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.href = src;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  });
}

/**
 * Lazy load component when it enters viewport
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = React.useRef<T>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || isLoaded) return;

    const observer = createIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true);
          callback();
          observer?.unobserve(element);
        }
      });
    }, options);

    if (observer) {
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [callback, isLoaded, options]);

  return { ref, isLoaded };
}
