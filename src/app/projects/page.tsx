import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProjects, type ProjectContent } from "@/lib/content-parser";
import { ProjectsPageContent } from "./projects-page-content";
import { generateProjectsMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateProjectsMetadata();

export default function ProjectsPage() {
  let projects: ProjectContent[];

  try {
    projects = getAllProjects();
  } catch (error) {
    console.error("Error loading projects:", error);
    projects = [];
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of projects I've built, from full-stack applications to
          interactive experiences. Each project represents a unique challenge
          and learning opportunity.
        </p>
      </div>

      <Suspense fallback={<div>Loading projects...</div>}>
        {projects.length > 0 ? (
          <ProjectsPageContent projects={projects} />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects available
              </h3>
              <p className="text-muted-foreground">
                Projects are being loaded. Please check back later.
              </p>
            </div>
          </div>
        )}
      </Suspense>

      {/* Call to Action */}
      <div className="text-center mt-16 p-8 bg-muted/50 rounded-lg">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Interested in working together?
        </h3>
        <p className="text-muted-foreground mb-4">
          I'm always excited to take on new challenges and collaborate on
          interesting projects.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
