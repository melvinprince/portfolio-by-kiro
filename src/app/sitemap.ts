import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content-parser";
import { seoConfig } from "@/lib/seo-config";

const siteUrl = seoConfig.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tech`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Add project pages
  try {
    const projects = getAllProjects();
    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
      // Calculate last modified date based on project year or current date
      const lastModified = project.frontmatter.publishedAt
        ? new Date(project.frontmatter.publishedAt)
        : new Date(`${project.frontmatter.year}-01-01`);

      return {
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: project.frontmatter.featured ? 0.9 : 0.8,
      };
    });

    routes.push(...projectRoutes);
  } catch (error) {
    console.error("Error generating project sitemap entries:", error);
    // Continue without project routes if there's an error
  }

  return routes;
}
