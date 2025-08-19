"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  createMotionProps,
  motionVariants,
  motionTransitions,
} from "@/lib/motion-utils";
import { ReactNode } from "react";

interface MotionWrapperProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  variant?: keyof typeof motionVariants;
  delay?: number;
  duration?: number;
  className?: string;
}

export function MotionWrapper({
  children,
  variant = "fadeInUp",
  delay = 0,
  duration,
  className,
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = motionVariants[variant];

  const transition = {
    ...motionTransitions.default,
    delay,
    ...(duration && { duration }),
  };

  const motionProps = createMotionProps(
    variants,
    transition,
    prefersReducedMotion
  );

  return (
    <motion.div className={className} {...motionProps} {...props}>
      {children}
    </motion.div>
  );
}
