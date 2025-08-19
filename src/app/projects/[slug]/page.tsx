import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjects } from "@/lib/content-parser";
import { ProjectDetailPage } from "./project-detail-page";
import { generateProjectMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/seo/structured-data";
import {
  generateProjectSchema,
  generateBreadcrumbSchema,
  generateStructuredData,
} from "@/lib/structured-data";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const projects = getAllProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    const { frontmatter } = project;

    return generateProjectMetadata({
      title: frontmatter.title,
      summary: frontmatter.summary,
      slug: frontmatter.slug,
      tech: frontmatter.tech,
      year: frontmatter.year,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project | Portfolio",
      description: "View project details and information.",
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter } = project;

  const structuredData = generateStructuredData([
    generateProjectSchema({
      title: frontmatter.title,
      summary: frontmatter.summary,
      slug: frontmatter.slug,
      tech: frontmatter.tech,
      year: frontmatter.year,
      liveUrl: frontmatter.liveUrl,
      repoUrl: frontmatter.repoUrl,
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Projects", url: "/projects" },
      { name: frontmatter.title, url: `/projects/${slug}` },
    ]),
  ]);

  return (
    <>
      <ProjectDetailPage project={project} />
      <StructuredData data={structuredData} />
    </>
  );
}
