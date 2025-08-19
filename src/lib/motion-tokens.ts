/**
 * Motion design tokens for consistent animations across the application
 */

export const motionTokens = {
  duration: {
    xs: 0.12, // 120ms
    s: 0.24, // 240ms
    m: 0.42, // 420ms
    l: 0.7, // 700ms
  },
  easing: {
    default: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
  spring: {
    gentle: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
    bouncy: {
      type: "spring" as const,
      damping: 15,
      stiffness: 400,
    },
    snappy: {
      type: "spring" as const,
      damping: 30,
      stiffness: 500,
    },
  },
  stagger: {
    xs: 0.05,
    s: 0.1,
    m: 0.15,
    l: 0.2,
  },
} as const;

export type MotionTokens = typeof motionTokens;
