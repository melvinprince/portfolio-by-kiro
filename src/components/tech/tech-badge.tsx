"use client";

import * as React from "react";
import { TechItem } from "@/data/tech-stack";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  focusRingStyles,
  touchTargetStyles,
  handleKeyboardActivation,
} from "@/lib/accessibility-utils";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  tech: TechItem;
  showLevel?: boolean;
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

const levelColors = {
  learning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300",
  intermediate:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300",
  advanced:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300",
  expert:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300",
};

const levelIcons = {
  learning: "🌱",
  intermediate: "⚡",
  advanced: "🚀",
  expert: "⭐",
};

const confidenceIndicators = {
  learning: { dots: 1, label: "Learning" },
  intermediate: { dots: 2, label: "Intermediate" },
  advanced: { dots: 3, label: "Advanced" },
  expert: { dots: 4, label: "Expert" },
};

export function TechBadge({
  tech,
  showLevel = true,
  showTooltip = true,
  className,
  onClick,
}: TechBadgeProps) {
  const [isKeyboardFocused, setIsKeyboardFocused] = React.useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick) {
      handleKeyboardActivation(event, onClick);
    }
  };

  const handleFocus = (event: React.FocusEvent) => {
    // Detect if focus came from keyboard navigation
    setIsKeyboardFocused(event.target.matches(":focus-visible"));
  };

  const yearsExperience = new Date().getFullYear() - tech.since + 1;

  const badgeContent = (
    <Badge
      variant="secondary"
      className={cn(
        "group relative cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:scale-105",
        focusRingStyles,
        touchTargetStyles,
        isKeyboardFocused && "ring-2 ring-ring ring-offset-2",
        levelColors[tech.level],
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={() => setIsKeyboardFocused(false)}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : undefined}
      aria-label={`${tech.name} - ${
        confidenceIndicators[tech.level].label
      } level technology. ${tech.description}`}
      aria-describedby={showTooltip ? `${tech.name}-tooltip` : undefined}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{levelIcons[tech.level]}</span>
        <span className="font-medium">{tech.name}</span>

        {showLevel && (
          <div className="flex items-center gap-1 ml-1">
            {/* Confidence level dots */}
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    index < confidenceIndicators[tech.level].dots
                      ? "bg-current opacity-100"
                      : "bg-current opacity-20"
                  )}
                />
              ))}
            </div>
            <span className="sr-only">
              {confidenceIndicators[tech.level].label} level
            </span>
          </div>
        )}
      </div>
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3"
          sideOffset={8}
          id={`${tech.name}-tooltip`}
          role="tooltip"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{tech.name}</span>
              <span className="text-xs opacity-75">
                {confidenceIndicators[tech.level].label}
              </span>
            </div>

            <p className="text-xs leading-relaxed">{tech.description}</p>

            <div className="flex items-center justify-between text-xs opacity-75">
              <span>Since {tech.since}</span>
              <span>
                {yearsExperience} year{yearsExperience !== 1 ? "s" : ""}
              </span>
            </div>

            {tech.useCases.length > 0 && (
              <div className="pt-1 border-t border-current/20">
                <div className="text-xs opacity-75 mb-1">Use cases:</div>
                <div className="flex flex-wrap gap-1">
                  {tech.useCases.slice(0, 3).map((useCase) => (
                    <span
                      key={useCase}
                      className="px-1.5 py-0.5 text-xs bg-current/10 rounded"
                    >
                      {useCase}
                    </span>
                  ))}
                  {tech.useCases.length > 3 && (
                    <span className="text-xs opacity-75">
                      +{tech.useCases.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
