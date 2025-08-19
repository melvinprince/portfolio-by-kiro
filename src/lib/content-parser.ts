import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  validateProjectFrontmatter,
  calculateReadingTime,
  type ProjectFrontmatter,
  type ProjectContent,
} from "./content-schema";

// Re-export types for convenience
export type { ProjectFrontmatter, ProjectContent };

// Content directory paths
const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

// Ensure content directories exist
export function ensureContentDirectories() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
}

// Get all project slugs
export function getProjectSlugs(): string[] {
  ensureContentDirectories();

  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

// Parse a single project file
export function parseProjectFile(slug: string): ProjectContent | null {
  try {
    const fullPath = path.join(PROJECTS_DIR, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = validateProjectFrontmatter(data);

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    return {
      frontmatter,
      content,
      slug,
      readingTime,
    };
  } catch (error) {
    console.error(`Error parsing project file ${slug}:`, error);
    return null;
  }
}

// Get all projects
export function getAllProjects(): ProjectContent[] {
  const slugs = getProjectSlugs();

  return slugs
    .map((slug) => parseProjectFile(slug))
    .filter((project): project is ProjectContent => project !== null)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

// Get featured projects
export function getFeaturedProjects(): ProjectContent[] {
  return getAllProjects().filter((project) => project.frontmatter.featured);
}

// Get project by slug
export function getProjectBySlug(slug: string): ProjectContent | null {
  return parseProjectFile(slug);
}

// Get projects by technology
export function getProjectsByTech(tech: string): ProjectContent[] {
  return getAllProjects().filter((project) =>
    project.frontmatter.tech.includes(tech)
  );
}

// Get projects by tag
export function getProjectsByTag(tag: string): ProjectContent[] {
  return getAllProjects().filter((project) =>
    project.frontmatter.tags.includes(tag)
  );
}

// Get projects by year
export function getProjectsByYear(year: number): ProjectContent[] {
  return getAllProjects().filter(
    (project) => project.frontmatter.year === year
  );
}

// Search projects by query
export function searchProjects(query: string): ProjectContent[] {
  const lowercaseQuery = query.toLowerCase();

  return getAllProjects().filter((project) => {
    const { title, summary, tags, tech } = project.frontmatter;
    const searchableText = [title, summary, ...tags, ...tech, project.content]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(lowercaseQuery);
  });
}

// Get all unique technologies used across projects
export function getAllTechnologies(): string[] {
  const allTech = getAllProjects().flatMap(
    (project) => project.frontmatter.tech
  );

  return [...new Set(allTech)].sort();
}

// Get all unique tags used across projects
export function getAllTags(): string[] {
  const allTags = getAllProjects().flatMap(
    (project) => project.frontmatter.tags
  );

  return [...new Set(allTags)].sort();
}

// Get all unique years
export function getAllYears(): number[] {
  const allYears = getAllProjects().map((project) => project.frontmatter.year);

  return [...new Set(allYears)].sort((a, b) => b - a);
}

// Get project statistics
export function getProjectStats() {
  const projects = getAllProjects();

  return {
    total: projects.length,
    featured: projects.filter((p) => p.frontmatter.featured).length,
    technologies: getAllTechnologies().length,
    tags: getAllTags().length,
    years: getAllYears().length,
    averageReadingTime: Math.round(
      projects.reduce((sum, p) => sum + (p.readingTime || 0), 0) /
        projects.length
    ),
  };
}

// Validate all project files
export function validateAllProjects(): {
  valid: string[];
  invalid: { slug: string; error: string }[];
} {
  const slugs = getProjectSlugs();
  const valid: string[] = [];
  const invalid: { slug: string; error: string }[] = [];

  for (const slug of slugs) {
    try {
      const project = parseProjectFile(slug);
      if (project) {
        valid.push(slug);
      } else {
        invalid.push({ slug, error: "Failed to parse project file" });
      }
    } catch (error) {
      invalid.push({
        slug,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { valid, invalid };
}
