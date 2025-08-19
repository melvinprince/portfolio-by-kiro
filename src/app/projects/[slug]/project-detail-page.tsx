"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { MDXContent } from "@/components/mdx/mdx-content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProjectContent } from "@/lib/content-parser";

interface ProjectDetailPageProps {
  project: ProjectContent;
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const { frontmatter, content, readingTime } = project;
  const prefersReducedMotion = useReducedMotion();

  const pageVariants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  const headerVariants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
        delay: prefersReducedMotion ? 0 : 0.2,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen"
    >
      {/* Back Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section variants={headerVariants} className="relative">
        {/* Cover Image */}
        {frontmatter.cover && (
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image
              src={frontmatter.cover}
              alt={`${frontmatter.title} cover image`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

            {/* Featured Badge */}
            {frontmatter.featured && (
              <div className="absolute top-6 right-6">
                <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured Project
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Project Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{frontmatter.year}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {frontmatter.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {frontmatter.summary}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {frontmatter.liveUrl && (
                <Button asChild size="lg">
                  <a
                    href={frontmatter.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {frontmatter.repoUrl && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={frontmatter.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View Source
                  </a>
                </Button>
              )}
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tech.map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {frontmatter.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Project Gallery */}
      {frontmatter.gallery && frontmatter.gallery.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Project Gallery
              </h2>
              <ProjectGallery
                images={frontmatter.gallery}
                projectTitle={frontmatter.title}
              />
            </div>
          </div>
        </section>
      )}

      {/* Project Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXContent content={content} />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to Other Projects */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Explore More Projects
            </h2>
            <p className="text-muted-foreground mb-8">
              Check out other projects in my portfolio
            </p>
            <Button asChild size="lg">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
