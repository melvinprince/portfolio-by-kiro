"use client";

import { useEffect, useRef } from "react";
import { gsapAnimations } from "@/lib/gsap-utils";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Hook for GSAP scroll-triggered animations
 */
export function useGSAP() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Don't initialize GSAP if user prefers reduced motion
    if (prefersReducedMotion) return;

    gsapAnimations.init();

    return () => {
      gsapAnimations.cleanup();
    };
  }, [prefersReducedMotion]);

  return {
    fadeInOnScroll: prefersReducedMotion
      ? () => {}
      : gsapAnimations.fadeInOnScroll.bind(gsapAnimations),
    staggerOnScroll: prefersReducedMotion
      ? () => {}
      : gsapAnimations.staggerOnScroll.bind(gsapAnimations),
    parallax: prefersReducedMotion
      ? () => {}
      : gsapAnimations.parallax.bind(gsapAnimations),
    refresh: gsapAnimations.refresh.bind(gsapAnimations),
    cleanup: gsapAnimations.cleanup.bind(gsapAnimations),
  };
}

/**
 * Hook for element refs with GSAP animations
 */
export function useGSAPRef<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const { fadeInOnScroll, staggerOnScroll, parallax } = useGSAP();

  return {
    ref,
    fadeInOnScroll: (options?: Parameters<typeof fadeInOnScroll>[1]) =>
      ref.current ? fadeInOnScroll(ref.current, options) : undefined,
    staggerOnScroll: (options?: Parameters<typeof staggerOnScroll>[1]) =>
      ref.current ? staggerOnScroll(ref.current, options) : undefined,
    parallax: (options?: Parameters<typeof parallax>[1]) =>
      ref.current ? parallax(ref.current, options) : undefined,
  };
}
