import {
  getAllProjects,
  getFeaturedProjects as getContentFeaturedProjects,
  getProjectBySlug as getContentProjectBySlug,
  getProjectsByTech as getContentProjectsByTech,
  type ProjectContent,
} from "@/lib/content-parser";

// Legacy interface for backward compatibility
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  tags: string[];
  year: number;
  repoUrl?: string;
  liveUrl?: string;
  tech: string[];
  cover: string;
  gallery?: string[];
  featured: boolean;
  order: number;
  challenges?: string[];
  outcomes?: string[];
}

// Convert ProjectContent to legacy Project format
function convertToLegacyProject(projectContent: ProjectContent): Project {
  const { frontmatter, content } = projectContent;

  return {
    id: frontmatter.slug,
    title: frontmatter.title,
    slug: frontmatter.slug,
    summary: frontmatter.summary,
    description: content.slice(0, 200) + "...", // First 200 chars as description
    tags: frontmatter.tags,
    year: frontmatter.year,
    repoUrl: frontmatter.repoUrl,
    liveUrl: frontmatter.liveUrl,
    tech: frontmatter.tech,
    cover: frontmatter.cover,
    gallery: frontmatter.gallery,
    featured: frontmatter.featured,
    order: frontmatter.order,
    challenges: [], // These would be extracted from content if needed
    outcomes: [], // These would be extracted from content if needed
  };
}

// Get projects from MDX content with fallback to static data
export const projects: Project[] = (() => {
  try {
    const contentProjects = getAllProjects();
    if (contentProjects.length > 0) {
      return contentProjects.map(convertToLegacyProject);
    }
  } catch (error) {
    console.warn(
      "Failed to load projects from content files, using fallback data:",
      error
    );
  }

  // Fallback static data (keeping original data as backup)
  return [
    {
      id: "1",
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      summary:
        "Full-stack e-commerce solution with modern payment integration and admin dashboard",
      description:
        "A comprehensive e-commerce platform built with Next.js and TypeScript, featuring user authentication, product management, shopping cart functionality, and Stripe payment integration.",
      tags: ["Full Stack", "E-Commerce", "Payment Integration"],
      year: 2024,
      repoUrl: "https://github.com/melvinprince/ecommerce-platform",
      liveUrl: "https://ecommerce-demo.vercel.app",
      tech: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Stripe",
        "Tailwind CSS",
      ],
      cover:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop",
      ],
      featured: true,
      order: 1,
      challenges: ["Implementing secure payment processing with Stripe"],
      outcomes: ["Achieved 99.9% uptime with robust error handling"],
    },
    {
      id: "2",
      title: "Task Management App",
      slug: "task-management-app",
      summary:
        "Collaborative task management application with real-time updates and team features",
      description:
        "A modern task management application inspired by Trello and Asana, featuring drag-and-drop functionality, real-time collaboration, team workspaces, and advanced filtering.",
      tags: ["Productivity", "Real-time", "Collaboration"],
      year: 2024,
      repoUrl: "https://github.com/melvinprince/task-manager",
      liveUrl: "https://taskflow-demo.vercel.app",
      tech: [
        "React",
        "Node.js",
        "Socket.io",
        "MongoDB",
        "Express",
        "Material-UI",
      ],
      cover:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      featured: true,
      order: 2,
      challenges: [
        "Implementing real-time synchronization across multiple users",
      ],
      outcomes: ["Achieved sub-100ms real-time update latency"],
    },
    {
      id: "3",
      title: "Weather Dashboard",
      slug: "weather-dashboard",
      summary:
        "Interactive weather dashboard with data visualization and location-based forecasts",
      description:
        "A comprehensive weather dashboard that provides current conditions, 7-day forecasts, and interactive maps.",
      tags: ["Data Visualization", "API Integration", "PWA"],
      year: 2023,
      repoUrl: "https://github.com/melvinprince/weather-dashboard",
      liveUrl: "https://weather-viz.vercel.app",
      tech: ["Vue.js", "D3.js", "OpenWeather API", "Chart.js", "PWA"],
      cover:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
      featured: true,
      order: 3,
      challenges: ["Handling multiple weather API integrations"],
      outcomes: ["Achieved 95+ Lighthouse performance score"],
    },
  ];
})();

// Export functions that use content system when available
export const getFeaturedProjects = (): Project[] => {
  try {
    const contentProjects = getContentFeaturedProjects();
    if (contentProjects.length > 0) {
      return contentProjects.map(convertToLegacyProject);
    }
  } catch (error) {
    console.warn("Failed to get featured projects from content:", error);
  }
  return projects.filter((p) => p.featured);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  try {
    const contentProject = getContentProjectBySlug(slug);
    if (contentProject) {
      return convertToLegacyProject(contentProject);
    }
  } catch (error) {
    console.warn("Failed to get project by slug from content:", error);
  }
  return projects.find((p) => p.slug === slug);
};

export const getProjectsByTech = (tech: string): Project[] => {
  try {
    const contentProjects = getContentProjectsByTech(tech);
    if (contentProjects.length > 0) {
      return contentProjects.map(convertToLegacyProject);
    }
  } catch (error) {
    console.warn("Failed to get projects by tech from content:", error);
  }
  return projects.filter((p) => p.tech.includes(tech));
};

// Export content system functions for direct use
export {
  getAllProjects as getAllProjectsContent,
  getFeaturedProjects as getFeaturedProjectsContent,
  getProjectBySlug as getProjectBySlugContent,
  getProjectsByTech as getProjectsByTechContent,
  type ProjectContent,
} from "@/lib/content-parser";
