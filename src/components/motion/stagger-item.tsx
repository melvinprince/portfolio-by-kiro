"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionVariants, motionTransitions } from "@/lib/motion-utils";
import { ReactNode } from "react";

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={motionVariants.staggerItem}
      transition={motionTransitions.default}
      {...props}
    >
      {children}
    </motion.div>
  );
}
