"use client";

import { RefObject } from "react";

// Dynamic imports for GSAP to reduce initial bundle size
let gsap: any = null;
let ScrollTrigger: any = null;

/**
 * Dynamically import GSAP and ScrollTrigger
 */
export async function initGSAP() {
  if (typeof window === "undefined") return null;

  if (!gsap) {
    const gsapModule = await import("gsap");
    gsap = gsapModule.gsap;
  }

  if (!ScrollTrigger) {
    const scrollTriggerModule = await import("gsap/ScrollTrigger");
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }

  return { gsap, ScrollTrigger };
}

/**
 * GSAP animation utilities
 */
export class GSAPAnimations {
  private static instance: GSAPAnimations;
  private initialized = false;

  static getInstance(): GSAPAnimations {
    if (!GSAPAnimations.instance) {
      GSAPAnimations.instance = new GSAPAnimations();
    }
    return GSAPAnimations.instance;
  }

  async init() {
    if (this.initialized) return;
    await initGSAP();
    this.initialized = true;
  }

  /**
   * Fade in animation with scroll trigger
   */
  async fadeInOnScroll(
    element: RefObject<HTMLElement> | HTMLElement | string,
    options: {
      y?: number;
      duration?: number;
      delay?: number;
      start?: string;
      end?: string;
      scrub?: boolean;
    } = {}
  ) {
    await this.init();
    if (!gsap || !ScrollTrigger) return;

    const {
      y = 50,
      duration = 0.8,
      delay = 0,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
    } = options;

    const target =
      typeof element === "string"
        ? element
        : "current" in element
        ? element.current
        : element;

    if (!target) return;

    gsap.fromTo(
      target,
      {
        opacity: 0,
        y,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: target,
          start,
          end,
          scrub,
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  /**
   * Stagger animation for multiple elements
   */
  async staggerOnScroll(
    elements: RefObject<HTMLElement> | HTMLElement | string,
    options: {
      y?: number;
      duration?: number;
      stagger?: number;
      start?: string;
      end?: string;
    } = {}
  ) {
    await this.init();
    if (!gsap || !ScrollTrigger) return;

    const {
      y = 30,
      duration = 0.6,
      stagger = 0.1,
      start = "top 80%",
      end = "bottom 20%",
    } = options;

    const target =
      typeof elements === "string"
        ? elements
        : "current" in elements
        ? elements.current
        : elements;

    if (!target) return;

    gsap.fromTo(
      target,
      {
        opacity: 0,
        y,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: target,
          start,
          end,
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  /**
   * Parallax effect
   */
  async parallax(
    element: RefObject<HTMLElement> | HTMLElement | string,
    options: {
      y?: string;
      start?: string;
      end?: string;
    } = {}
  ) {
    await this.init();
    if (!gsap || !ScrollTrigger) return;

    const { y = "-50%", start = "top bottom", end = "bottom top" } = options;

    const target =
      typeof element === "string"
        ? element
        : "current" in element
        ? element.current
        : element;

    if (!target) return;

    gsap.to(target, {
      y,
      ease: "none",
      scrollTrigger: {
        trigger: target,
        start,
        end,
        scrub: true,
      },
    });
  }

  /**
   * Cleanup all ScrollTrigger instances
   */
  cleanup() {
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    }
  }

  /**
   * Refresh ScrollTrigger (useful after layout changes)
   */
  refresh() {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }
}

// Export singleton instance
export const gsapAnimations = GSAPAnimations.getInstance();
