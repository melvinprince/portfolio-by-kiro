import { describe, it, expect } from "vitest";
import {
  motionVariants,
  motionTransitions,
  createMotionProps,
  createStaggerProps,
} from "../motion-utils";

describe("motion-utils", () => {
  describe("motionVariants", () => {
    it("should have correct fadeIn variants", () => {
      expect(motionVariants.fadeIn).toEqual({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      });
    });

    it("should have correct fadeInUp variants", () => {
      expect(motionVariants.fadeInUp).toEqual({
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -24 },
      });
    });

    it("should have correct scaleIn variants", () => {
      expect(motionVariants.scaleIn).toEqual({
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      });
    });

    it("should have stagger variants", () => {
      expect(motionVariants.staggerContainer).toHaveProperty("initial");
      expect(motionVariants.staggerContainer).toHaveProperty("animate");
      expect(motionVariants.staggerItem).toEqual({
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      });
    });
  });

  describe("motionTransitions", () => {
    it("should have default transition", () => {
      expect(motionTransitions.default).toHaveProperty("duration");
      expect(motionTransitions.default).toHaveProperty("ease");
    });

    it("should have spring transitions", () => {
      expect(motionTransitions.spring).toHaveProperty("type", "spring");
      expect(motionTransitions.springBouncy).toHaveProperty("type", "spring");
      expect(motionTransitions.springSnappy).toHaveProperty("type", "spring");
    });
  });

  describe("createMotionProps", () => {
    it("should return motion props when reduced motion is false", () => {
      const variants = motionVariants.fadeIn;
      const props = createMotionProps(
        variants,
        motionTransitions.default,
        false
      );

      expect(props).toEqual({
        variants,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: motionTransitions.default,
      });
    });

    it("should return disabled props when reduced motion is true", () => {
      const variants = motionVariants.fadeIn;
      const props = createMotionProps(
        variants,
        motionTransitions.default,
        true
      );

      expect(props).toEqual({
        initial: false,
        animate: false,
        transition: { duration: 0 },
      });
    });

    it("should use default transition when none provided", () => {
      const variants = motionVariants.fadeIn;
      const props = createMotionProps(variants, undefined, false);

      expect(props.transition).toEqual(motionTransitions.default);
    });
  });

  describe("createStaggerProps", () => {
    it("should return stagger props when reduced motion is false", () => {
      const props = createStaggerProps(0.1, false);

      expect(props).toEqual({
        variants: motionVariants.staggerContainer,
        initial: "initial",
        animate: "animate",
        transition: {
          staggerChildren: 0.1,
        },
      });
    });

    it("should return disabled props when reduced motion is true", () => {
      const props = createStaggerProps(0.1, true);

      expect(props).toEqual({
        initial: false,
        animate: false,
      });
    });

    it("should use default stagger delay when none provided", () => {
      const props = createStaggerProps(undefined, false);

      expect(props.transition).toHaveProperty("staggerChildren");
    });
  });
});
