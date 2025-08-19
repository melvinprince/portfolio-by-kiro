import { z } from "zod";

// Project frontmatter schema
export const projectFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  summary: z.string().min(1, "Summary is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  year: z
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 1),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  tech: z.array(z.string()).min(1, "At least one technology is required"),
  cover: z.string().min(1, "Cover image is required"),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0),
  publishedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Parsed project content type
export const projectContentSchema = z.object({
  frontmatter: projectFrontmatterSchema,
  content: z.string(),
  slug: z.string(),
  readingTime: z.number().optional(),
});

// Export types
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectContent = z.infer<typeof projectContentSchema>;

// Validation functions
export function validateProjectFrontmatter(data: unknown): ProjectFrontmatter {
  return projectFrontmatterSchema.parse(data);
}

export function validateProjectContent(data: unknown): ProjectContent {
  return projectContentSchema.parse(data);
}

// Helper function to calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
