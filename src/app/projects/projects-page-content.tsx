"use client";

import { useEffect, useState } from "react";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { useUrlParams } from "@/hooks/use-url-params";
import type { ProjectContent } from "@/lib/content-parser";

interface ProjectsPageContentProps {
  projects: ProjectContent[];
}

export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  const { getParam, getParamAsNumber, updateParams } = useUrlParams();

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<{
    q?: string;
    tech?: string;
    year?: number;
    tag?: string;
  }>(() => ({
    q: getParam("q"),
    tech: getParam("tech"),
    year: getParamAsNumber("year"),
    tag: getParam("tag"),
  }));

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      q: getParam("q"),
      tech: getParam("tech"),
      year: getParamAsNumber("year"),
      tag: getParam("tag"),
    });
  }, [getParam, getParamAsNumber]);

  const handleFilterChange = (newFilters: typeof filters = {}) => {
    setFilters(newFilters);
    updateParams(newFilters);
  };

  return (
    <ProjectsGrid
      projects={projects}
      initialFilters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
