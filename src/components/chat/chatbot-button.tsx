"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionTokens } from "@/lib/motion-tokens";
import {
  getExpandableAttributes,
  getIconButtonLabel,
} from "@/lib/accessibility-utils";
import { cn } from "@/lib/utils";

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnreadMessage?: boolean;
  className?: string;
}

export function ChatbotButton({
  isOpen,
  onClick,
  hasUnreadMessage = false,
  className,
}: ChatbotButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const buttonVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : motionTokens.spring.gentle,
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : motionTokens.duration.s,
      },
    },
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        className="relative"
      >
        {/* Notification pulse for unread messages */}
        <AnimatePresence>
          {hasUnreadMessage && !isOpen && (
            <motion.div
              initial={{ scale: 1, opacity: 0.7 }}
              animate={
                prefersReducedMotion
                  ? { scale: 1, opacity: 0.7 }
                  : {
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0.3, 0.7],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
              exit={{ scale: 1, opacity: 0.7 }}
              className="absolute inset-0 rounded-full bg-primary"
              style={{ zIndex: -1 }}
            />
          )}
        </AnimatePresence>

        <Button
          onClick={onClick}
          size="lg"
          className={cn(
            "size-14 rounded-full shadow-lg hover:shadow-xl transition-shadow",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            hasUnreadMessage &&
              !isOpen &&
              "ring-2 ring-primary/50 ring-offset-2"
          )}
          aria-label={getIconButtonLabel(
            isOpen ? "Close" : "Open",
            "chat assistant",
            hasUnreadMessage && !isOpen ? "new message available" : undefined
          )}
          {...getExpandableAttributes(isOpen, "chat-panel")}
          aria-describedby={
            hasUnreadMessage && !isOpen ? "chat-notification" : undefined
          }
        >
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: motionTokens.duration.m,
                    ease: "easeInOut",
                  },
            }}
          >
            {isOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <MessageCircle className="size-6" aria-hidden="true" />
            )}
          </motion.div>
        </Button>

        {/* Unread indicator dot */}
        <AnimatePresence>
          {hasUnreadMessage && !isOpen && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: prefersReducedMotion
                    ? { duration: 0 }
                    : motionTokens.spring.bouncy,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: {
                    duration: prefersReducedMotion
                      ? 0
                      : motionTokens.duration.xs,
                  },
                }}
                className="absolute -top-1 -right-1 size-4 bg-destructive rounded-full border-2 border-background"
                aria-hidden="true"
              />
              <span id="chat-notification" className="sr-only">
                New message available in chat
              </span>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
