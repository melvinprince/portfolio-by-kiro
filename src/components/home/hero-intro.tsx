"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionTransitions } from "@/lib/motion-utils";
import { focusRingStyles, touchTargetStyles } from "@/lib/accessibility-utils";
import { personalInfo } from "@/data/personal";
import { cn } from "@/lib/utils";

interface HeroIntroProps {
  title?: string;
  subtitle?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
}

export function HeroIntro({
  title = `Hi, I'm ${personalInfo.name}`,
  subtitle = personalInfo.role,
  ctaPrimaryHref = "/projects",
  ctaSecondaryHref = "/contact",
}: HeroIntroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: motionTransitions.default,
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: motionTransitions.default,
    },
  };

  if (prefersReducedMotion) {
    return (
      <section className="py-20 text-center" aria-labelledby="hero-title">
        <div className="max-w-4xl mx-auto">
          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {title}
          </h1>
          <p
            className="text-xl sm:text-2xl text-muted-foreground mb-4"
            aria-describedby="hero-subtitle"
          >
            <span id="hero-subtitle">{subtitle}</span>
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {personalInfo.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={ctaPrimaryHref}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors",
                focusRingStyles,
                touchTargetStyles
              )}
              aria-label="View my projects and portfolio work"
            >
              View Projects
            </a>
            <a
              href={ctaSecondaryHref}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors",
                focusRingStyles,
                touchTargetStyles
              )}
              aria-label="Contact me for collaboration opportunities"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 text-center" aria-labelledby="hero-title">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          id="hero-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          variants={textVariants}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-muted-foreground mb-4"
          variants={textVariants}
          aria-describedby="hero-subtitle"
        >
          <span id="hero-subtitle">{subtitle}</span>
        </motion.p>
        <motion.p
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          variants={textVariants}
        >
          {personalInfo.tagline}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={buttonVariants}
        >
          <motion.a
            href={ctaPrimaryHref}
            className={cn(
              "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors",
              focusRingStyles,
              touchTargetStyles
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View my projects and portfolio work"
          >
            View Projects
          </motion.a>
          <motion.a
            href={ctaSecondaryHref}
            className={cn(
              "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors",
              focusRingStyles,
              touchTargetStyles
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Contact me for collaboration opportunities"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
