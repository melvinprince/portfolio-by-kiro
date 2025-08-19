import Link from "next/link";
import type { Metadata } from "next";
import { personalInfo } from "@/data/personal";
import { getFeaturedProjects } from "@/data/projects";
import { getFeaturedTech } from "@/data/tech-stack";
import {
  HeroIntro,
  ProjectCard,
  TechBadgePreview,
  BlogTeaser,
} from "@/components/home";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { generateHomeMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateHomeMetadata();

export default function Home() {
  const featuredProjects = getFeaturedProjects().slice(0, 3);
  const featuredTech = getFeaturedTech().slice(0, 8);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <HeroIntro />

      {/* About Section */}
      <section className="py-16" aria-labelledby="about-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="about-heading"
            className="text-3xl font-bold text-foreground mb-6"
          >
            About Me
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {personalInfo.bio}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span aria-label={`Location: ${personalInfo.location}`}>
              📍 {personalInfo.location}
            </span>
            <span className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
                role="img"
                aria-label="Available for work indicator"
              ></div>
              {personalInfo.availability.message}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16" aria-labelledby="featured-projects-heading">
        <div className="text-center mb-12">
          <h2
            id="featured-projects-heading"
            className="text-3xl font-bold text-foreground mb-4"
          >
            Featured Projects
          </h2>
          <p className="text-muted-foreground">Some of my recent work</p>
        </div>
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProjects.map((project, index) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label="View all projects in my portfolio"
          >
            View all projects →
          </Link>
        </div>
      </section>

      {/* Tech Stack Preview */}
      <TechBadgePreview techItems={featuredTech} />

      {/* Latest Blog Posts */}
      <BlogTeaser />
    </div>
  );
}
