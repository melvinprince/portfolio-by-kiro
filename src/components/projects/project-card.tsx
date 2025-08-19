"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { focusRingStyles, touchTargetStyles } from "@/lib/accessibility-utils";
import { cn } from "@/lib/utils";
import type { ProjectContent } from "@/lib/content-parser";

interface ProjectCardProps {
  project: ProjectContent;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { frontmatter } = project;

  const cardVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
    hover: {
      y: prefersReducedMotion ? 0 : -8,
      scale: prefersReducedMotion ? 1 : 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-border/50 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
        <Link
          href={`/projects/${frontmatter.slug}`}
          className={cn(
            "block h-full rounded-md",
            focusRingStyles,
            touchTargetStyles
          )}
          aria-label={`View project: ${frontmatter.title}`}
        >
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            <motion.div variants={imageVariants} className="w-full h-full">
              {frontmatter.cover ? (
                <Image
                  src={frontmatter.cover}
                  alt={`${frontmatter.title} cover image`}
                  fill
                  className="object-cover transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">No image</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Featured Badge */}
            {frontmatter.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </Badge>
              </div>
            )}

            {/* Year Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-background/90 text-foreground backdrop-blur-sm"
              >
                {frontmatter.year}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="group-hover:text-accent transition-colors duration-200 line-clamp-2">
                {frontmatter.title}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {frontmatter.summary}
            </p>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {/* Tech Stack */}
            <div>
              <div className="flex flex-wrap gap-1.5">
                {frontmatter.tech.slice(0, 4).map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
                {frontmatter.tech.length > 4 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
                  >
                    +{frontmatter.tech.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Tags */}
            {frontmatter.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {frontmatter.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-2 py-0.5 border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {frontmatter.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 border-border/50 text-muted-foreground"
                    >
                      +{frontmatter.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-4 pt-2">
              {frontmatter.liveUrl && (
                <div className="flex items-center gap-1 text-xs text-accent group-hover:text-accent/80 transition-colors">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Live Demo</span>
                </div>
              )}
              {frontmatter.repoUrl && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </div>
              )}
            </div>

            {/* Reading Time */}
            {project.readingTime && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                {project.readingTime} min read
              </div>
            )}
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
