"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { createStaggerProps, motionTokens } from "@/lib/motion-utils";
import { ReactNode } from "react";

interface StaggerContainerProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = motionTokens.stagger.s,
  className,
  ...props
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const staggerProps = createStaggerProps(staggerDelay, prefersReducedMotion);

  return (
    <motion.div className={className} {...staggerProps} {...props}>
      {children}
    </motion.div>
  );
}
