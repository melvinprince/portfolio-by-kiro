"use client";

import React, { useState, useEffect } from "react";
import { ChatbotButton } from "./chatbot-button";
import { ChatPanel } from "./chat-panel";

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasUnreadMessage(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Simulate unread message after some time (for demo purposes)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasUnreadMessage(true);
      }, 30000); // Show unread indicator after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <ChatbotButton
        isOpen={isOpen}
        onClick={handleToggle}
        hasUnreadMessage={hasUnreadMessage}
        className={className}
      />
      <ChatPanel isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
