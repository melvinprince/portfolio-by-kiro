"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectContent } from "@/lib/content-parser";

interface ProjectFiltersProps {
  projects: ProjectContent[];
  filters: {
    q?: string;
    tech?: string;
    year?: number;
    tag?: string;
  };
  onFilterChange: (filters: ProjectFiltersProps["filters"]) => void;
}

export function ProjectFilters({
  projects,
  filters,
  onFilterChange,
}: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || "");

  // Extract unique values from projects
  const { technologies, years, tags } = useMemo(() => {
    const allTech = projects.flatMap((p) => p.frontmatter.tech);
    const allYears = projects.map((p) => p.frontmatter.year);
    const allTags = projects.flatMap((p) => p.frontmatter.tags);

    return {
      technologies: [...new Set(allTech)].sort(),
      years: [...new Set(allYears)].sort((a, b) => b - a),
      tags: [...new Set(allTags)].sort(),
    };
  }, [projects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, q: searchQuery.trim() || undefined });
  };

  const handleTechFilter = (tech: string) => {
    onFilterChange({
      ...filters,
      tech: filters.tech === tech ? undefined : tech,
    });
  };

  const handleYearFilter = (year: number) => {
    onFilterChange({
      ...filters,
      year: filters.year === year ? undefined : year,
    });
  };

  const handleTagFilter = (tag: string) => {
    onFilterChange({
      ...filters,
      tag: filters.tag === tag ? undefined : tag,
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    onFilterChange({ ...filters, q: undefined });
  };

  return (
    <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
      {/* Search */}
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Search projects
        </label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="search"
              type="text"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {/* Technology Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge
              key={tech}
              variant={filters.tech === tech ? "default" : "secondary"}
              className="cursor-pointer hover:bg-accent/80 transition-colors"
              onClick={() => handleTechFilter(tech)}
            >
              {tech}
              {filters.tech === tech && (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Year</h3>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Badge
              key={year}
              variant={filters.year === year ? "default" : "secondary"}
              className="cursor-pointer hover:bg-accent/80 transition-colors"
              onClick={() => handleYearFilter(year)}
            >
              {year}
              {filters.year === year && (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tag === tag ? "default" : "secondary"}
              className="cursor-pointer hover:bg-accent/80 transition-colors"
              onClick={() => handleTagFilter(tag)}
            >
              {tag}
              {filters.tag === tag && (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.q || filters.tech || filters.year || filters.tag) && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Active filters:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                onFilterChange({});
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.q && (
              <Badge variant="outline" className="text-xs">
                Search: "{filters.q}"
              </Badge>
            )}
            {filters.tech && (
              <Badge variant="outline" className="text-xs">
                Tech: {filters.tech}
              </Badge>
            )}
            {filters.year && (
              <Badge variant="outline" className="text-xs">
                Year: {filters.year}
              </Badge>
            )}
            {filters.tag && (
              <Badge variant="outline" className="text-xs">
                Tag: {filters.tag}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
