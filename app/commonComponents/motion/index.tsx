"use client";

import React from "react";
import { motion, AnimatePresence, type HTMLMotionProps, type Variants, type Transition } from "framer-motion";

/* ==========================================================================
   1. CORE ANIMATION VARIANTS (Predefined, reusable motion tokens)
   ========================================================================== */

export const transitions: Record<"spring" | "smooth" | "gentle" | "bounce", Transition> = {
  spring: { type: "spring", damping: 25, stiffness: 300 },
  smooth: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  gentle: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  bounce: { type: "spring", damping: 15, stiffness: 400 },
};

export const fadeInVariants = (
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  distance: number = 24
): Variants => {
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      case "none":
      default:
        return {};
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getOffset(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: transitions.gentle,
    },
  };
};

export const staggerContainerVariants = (
  staggerChildren: number = 0.08,
  delayChildren: number = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const modalDialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 26, stiffness: 340 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const tabTransitionVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/* ==========================================================================
   2. REUSABLE MOTION COMPONENTS
   ========================================================================== */

/**
 * FadeIn: Animates into view with optional directional offset, delay and duration.
 */
interface FadeInProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  distance?: number;
  duration?: number;
  viewportOnce?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  duration,
  viewportOnce = true,
  className = "",
  ...props
}) => {
  const customVariants: Variants = {
    hidden: {
      opacity: 0,
      ...(direction === "up" ? { y: distance } : {}),
      ...(direction === "down" ? { y: -distance } : {}),
      ...(direction === "left" ? { x: distance } : {}),
      ...(direction === "right" ? { x: -distance } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration ?? 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger: Container that automatically staggers visible animation of StaggerItem children.
 */
interface StaggerProps extends HTMLMotionProps<"div"> {
  staggerChildren?: number;
  staggerDelay?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerChildren = 0.08,
  staggerDelay,
  delayChildren = 0.05,
  viewportOnce = true,
  className = "",
  ...props
}) => {
  const actualStagger = staggerDelay !== undefined ? staggerDelay : staggerChildren;
  return (
    <motion.div
      variants={staggerContainerVariants(actualStagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem: Child element for Stagger container.
 */
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  direction = "up",
  distance = 20,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      variants={fadeInVariants(direction, distance)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * HoverCard: Adds subtle hover elevation and scale, with gentle tap depression.
 */
interface HoverCardProps extends HTMLMotionProps<"div"> {
  scale?: number;
  yOffset?: number;
  hoverY?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  scale = 1.015,
  yOffset = -4,
  hoverY,
  className = "",
  ...props
}) => {
  const actualYOffset = hoverY !== undefined ? hoverY : yOffset;
  return (
    <motion.div
      whileHover={{
        y: actualYOffset,
        scale,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.99 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleIn: Pops in with a scale and fade-in animation.
 */
interface ScaleInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  viewportOnce?: boolean;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  viewportOnce = true,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Float: Gentle continuous vertical floating effect (ideal for hero imagery or badges).
 */
interface FloatProps extends HTMLMotionProps<"div"> {
  amplitude?: number;
  distance?: number;
  duration?: number;
  delay?: number;
}

export const Float: React.FC<FloatProps> = ({
  children,
  amplitude = 8,
  distance,
  duration = 4,
  delay = 0,
  className = "",
  ...props
}) => {
  const actualAmplitude = distance !== undefined ? distance : amplitude;
  return (
    <motion.div
      animate={{
        y: [-actualAmplitude, actualAmplitude, -actualAmplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedModal: Clean modal wrapper with AnimatePresence, backdrop fade, and spring dialog scale.
 */
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  className?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidthClass = "max-w-lg",
  className = "",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Dialog Content */}
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-full ${maxWidthClass} ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * TabPanel: Wraps tab contents for seamless slide/crossfade tab switching.
 */
interface TabPanelProps extends HTMLMotionProps<"div"> {
  tabKey: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabKey,
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      key={tabKey}
      variants={tabTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AccordionCollapse: Smooth height expand/collapse wrapper for FAQs and accordions.
 */
interface AccordionCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AccordionCollapse: React.FC<AccordionCollapseProps> = ({
  isOpen,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, delay: 0.05 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.15 },
            },
          }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Re-export core motion utilities for advanced custom use cases
export { motion, AnimatePresence };
