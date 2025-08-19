"use client";

import * as React from "react";
import { TechItem, techDomains, getTechByDomain } from "@/data/tech-stack";
import { TechBadge } from "./tech-badge";
import { cn } from "@/lib/utils";

interface TechGridProps {
  techStack: TechItem[];
  onTechClick?: (tech: TechItem) => void;
  className?: string;
  showDomainHeaders?: boolean;
  gridLayout?: "compact" | "comfortable" | "spacious";
}

const gridLayouts = {
  compact: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2",
  comfortable: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
  spacious: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
};

export function TechGrid({
  techStack,
  onTechClick,
  className,
  showDomainHeaders = true,
  gridLayout = "comfortable",
}: TechGridProps) {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const techRefs = React.useRef<(HTMLElement | null)[]>([]);

  // Group technologies by domain
  const groupedTech = React.useMemo(() => {
    if (!showDomainHeaders) {
      return [{ domain: null, techs: techStack }];
    }

    return techDomains
      .map((domain) => ({
        domain,
        techs: getTechByDomain(domain.key).filter((tech) =>
          techStack.includes(tech)
        ),
      }))
      .filter((group) => group.techs.length > 0);
  }, [techStack, showDomainHeaders]);

  // Flatten all techs for keyboard navigation
  const allTechs = React.useMemo(() => {
    return groupedTech.flatMap((group) => group.techs);
  }, [groupedTech]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (allTechs.length === 0) return;

      const currentIndex = focusedIndex;
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          newIndex = currentIndex < allTechs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "ArrowLeft":
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : allTechs.length - 1;
          break;
        case "ArrowDown":
          event.preventDefault();
          // Calculate grid columns based on current viewport
          const gridElement = gridRef.current;
          if (gridElement) {
            const computedStyle = window.getComputedStyle(gridElement);
            const columns = computedStyle.gridTemplateColumns.split(" ").length;
            newIndex = Math.min(currentIndex + columns, allTechs.length - 1);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          // Calculate grid columns based on current viewport
          const gridElementUp = gridRef.current;
          if (gridElementUp) {
            const computedStyle = window.getComputedStyle(gridElementUp);
            const columns = computedStyle.gridTemplateColumns.split(" ").length;
            newIndex = Math.max(currentIndex - columns, 0);
          }
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = allTechs.length - 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (currentIndex >= 0 && currentIndex < allTechs.length) {
            onTechClick?.(allTechs[currentIndex]);
          }
          return;
        default:
          return;
      }

      setFocusedIndex(newIndex);

      // Focus the corresponding element
      const targetRef = techRefs.current[newIndex];
      if (targetRef) {
        targetRef.focus();
      }
    },
    [focusedIndex, allTechs, onTechClick]
  );

  const handleTechFocus = React.useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleTechBlur = React.useCallback(() => {
    // Small delay to check if focus moved to another tech item
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isWithinGrid = gridRef.current?.contains(activeElement);
      if (!isWithinGrid) {
        setFocusedIndex(-1);
      }
    }, 0);
  }, []);

  React.useEffect(() => {
    // Reset refs array when techs change
    techRefs.current = techRefs.current.slice(0, allTechs.length);
  }, [allTechs.length]);

  let techIndex = 0;

  return (
    <div
      className={cn("space-y-8", className)}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label="Technology stack organized by domain"
    >
      {groupedTech.map((group, groupIndex) => (
        <section key={group.domain?.key || "all"} className="space-y-4">
          {group.domain && showDomainHeaders && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {group.domain.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {group.domain.description}
              </p>
            </div>
          )}

          <div
            ref={groupIndex === 0 ? gridRef : undefined}
            className={cn("grid", gridLayouts[gridLayout])}
            role="row"
          >
            {group.techs.map((tech) => {
              const currentTechIndex = techIndex++;
              return (
                <div
                  key={tech.name}
                  ref={(el) => {
                    techRefs.current[currentTechIndex] = el;
                  }}
                  role="gridcell"
                  tabIndex={focusedIndex === currentTechIndex ? 0 : -1}
                  onFocus={() => handleTechFocus(currentTechIndex)}
                  onBlur={handleTechBlur}
                  className="focus:outline-none"
                >
                  <TechBadge
                    tech={tech}
                    onClick={() => onTechClick?.(tech)}
                    className={cn(
                      "w-full justify-start",
                      focusedIndex === currentTechIndex &&
                        "ring-2 ring-ring ring-offset-2"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Screen reader instructions */}
      <div className="sr-only">
        Use arrow keys to navigate between technologies. Press Enter or Space to
        select a technology. Press Home to go to the first technology, End to go
        to the last.
      </div>
    </div>
  );
}
