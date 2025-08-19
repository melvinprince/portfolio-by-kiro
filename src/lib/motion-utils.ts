import { Variants, Transition } from "framer-motion";
import { motionTokens } from "./motion-tokens";

// Re-export motion tokens for convenience
export { motionTokens };

/**
 * Common animation variants for consistent motion design
 */
export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  fadeInUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
  } as Variants,

  fadeInDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
  } as Variants,

  fadeInLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 24 },
  } as Variants,

  fadeInRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  } as Variants,

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  } as Variants,

  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: motionTokens.stagger.s,
      },
    },
  } as Variants,

  // Stagger items
  staggerItem: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  } as Variants,
} as const;

/**
 * Common transitions
 */
export const motionTransitions = {
  default: {
    duration: motionTokens.duration.m,
    ease: [0.2, 0.8, 0.2, 1],
  } as Transition,

  fast: {
    duration: motionTokens.duration.s,
    ease: [0.2, 0.8, 0.2, 1],
  } as Transition,

  slow: {
    duration: motionTokens.duration.l,
    ease: [0.2, 0.8, 0.2, 1],
  } as Transition,

  spring: motionTokens.spring.gentle,
  springBouncy: motionTokens.spring.bouncy,
  springSnappy: motionTokens.spring.snappy,
} as const;

/**
 * Utility to create motion props with reduced motion support
 */
export function createMotionProps(
  variants: Variants,
  transition?: Transition,
  prefersReducedMotion = false
) {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: false,
      transition: { duration: 0 },
    };
  }

  return {
    variants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: transition || motionTransitions.default,
  };
}

/**
 * Utility to create stagger animation props
 */
export function createStaggerProps(
  staggerDelay: number = motionTokens.stagger.s,
  prefersReducedMotion = false
) {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: false,
    };
  }

  return {
    variants: motionVariants.staggerContainer,
    initial: "initial",
    animate: "animate",
    transition: {
      staggerChildren: staggerDelay,
    },
  };
}
