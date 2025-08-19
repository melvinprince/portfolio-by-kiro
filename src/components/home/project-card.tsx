"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionTransitions } from "@/lib/motion-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ...motionTransitions.default,
        delay: index * 0.1,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: motionTransitions.fast,
    },
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: motionTransitions.fast,
    },
  };

  if (prefersReducedMotion) {
    return (
      <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.cover}
            alt={`${project.title} cover image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white text-black text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/90 text-black text-sm rounded-md hover:bg-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-colors">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </CardTitle>
          <CardDescription>{project.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                +{project.tech.length - 3} more
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{project.year}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className="group hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        <Link href={`/projects/${project.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              variants={imageVariants}
              className="relative w-full h-full"
            >
              <Image
                src={project.cover}
                alt={`${project.title} cover image`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-black/20"
            />
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex gap-2">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white text-black text-sm rounded-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Live Demo
                  </motion.a>
                )}
                {project.repoUrl && (
                  <motion.a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/90 text-black text-sm rounded-md hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GitHub
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </Link>
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-colors">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </CardTitle>
          <CardDescription>{project.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                +{project.tech.length - 3} more
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{project.year}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
