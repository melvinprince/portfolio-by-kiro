"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProjectContent } from "@/lib/content-parser";

interface ProjectsGridProps {
  projects: ProjectContent[];
  initialFilters?: {
    q?: string;
    tech?: string;
    year?: number;
    tag?: string;
  };
  onFilterChange?: (filters: ProjectsGridProps["initialFilters"]) => void;
}

export function ProjectsGrid({
  projects,
  initialFilters = {},
  onFilterChange,
}: ProjectsGridProps) {
  const [filters, setFilters] = useState(initialFilters);
  const prefersReducedMotion = useReducedMotion();

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const { q, tech, year, tag } = filters;

      // Search query filter
      if (q) {
        const searchableText = [
          project.frontmatter.title,
          project.frontmatter.summary,
          ...project.frontmatter.tags,
          ...project.frontmatter.tech,
          project.content,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(q.toLowerCase())) {
          return false;
        }
      }

      // Technology filter
      if (tech && !project.frontmatter.tech.includes(tech)) {
        return false;
      }

      // Year filter
      if (year && project.frontmatter.year !== year) {
        return false;
      }

      // Tag filter
      if (tag && !project.frontmatter.tags.includes(tag)) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ProjectFilters
        projects={projects}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length === projects.length
            ? `${projects.length} projects`
            : `${filteredProjects.length} of ${projects.length} projects`}
        </p>

        {Object.keys(filters).some(
          (key) => filters[key as keyof typeof filters]
        ) && (
          <button
            onClick={() => handleFilterChange({})}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key="projects-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                layout={!prefersReducedMotion}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
