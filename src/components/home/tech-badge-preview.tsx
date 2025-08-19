"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { motionTransitions } from "@/lib/motion-utils";
import type { TechItem } from "@/data/tech-stack";

interface TechBadgePreviewProps {
  techItems: TechItem[];
}

function TechBadge({ tech, index }: { tech: TechItem; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  const getLevelIcon = (level: TechItem["level"]) => {
    switch (level) {
      case "expert":
        return "⭐⭐⭐";
      case "advanced":
        return "⭐⭐";
      case "intermediate":
        return "⭐";
      case "learning":
        return "📚";
      default:
        return "";
    }
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        ...motionTransitions.spring,
        delay: index * 0.05,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: motionTransitions.fast,
    },
  };

  if (prefersReducedMotion) {
    return (
      <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
        <span className="font-medium">{tech.name}</span>
        <span className="ml-2 text-xs opacity-70">
          {getLevelIcon(tech.level)}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors cursor-default"
    >
      <span className="font-medium">{tech.name}</span>
      <span className="ml-2 text-xs opacity-70">
        {getLevelIcon(tech.level)}
      </span>
    </motion.div>
  );
}

export function TechBadgePreview({ techItems }: TechBadgePreviewProps) {
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: motionTransitions.default,
    },
  };

  if (prefersReducedMotion) {
    return (
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Tech Stack
          </h2>
          <p className="text-muted-foreground">Technologies I work with</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {techItems.map((tech, index) => (
            <TechBadge key={tech.name} tech={tech} index={index} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/tech"
            className="inline-flex items-center text-accent hover:underline"
          >
            View full tech stack →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <motion.div
        className="text-center mb-12"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <h2 className="text-3xl font-bold text-foreground mb-4">Tech Stack</h2>
        <p className="text-muted-foreground">Technologies I work with</p>
      </motion.div>

      <StaggerContainer
        className="flex flex-wrap justify-center gap-3 mb-8"
        staggerDelay={0.05}
      >
        {techItems.map((tech, index) => (
          <StaggerItem key={tech.name}>
            <TechBadge tech={tech} index={index} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <motion.div
        className="text-center"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <Link
          href="/tech"
          className="inline-flex items-center text-accent hover:underline"
        >
          View full tech stack →
        </Link>
      </motion.div>
    </section>
  );
}
