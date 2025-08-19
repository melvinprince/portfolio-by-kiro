export const seoConfig = {
  // Site Information
  siteName: "Modern Portfolio",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.example.com",
  siteDescription:
    "A fast, accessible, visually rich personal portfolio showcasing modern web development projects, technical expertise, and professional experience.",

  // Author Information
  author: {
    name: "Melvin Prince",
    email: "melvin@example.com",
    twitter: "@melvinprince",
    github: "https://github.com/melvinprince",
    linkedin: "https://linkedin.com/in/melvinprince",
  },

  // Default Images
  defaultOgImage:
    "/api/og?title=Modern Portfolio&subtitle=Full Stack Developer",
  logo: "/logo.png",
  favicon: "/favicon.ico",

  // Social Media
  social: {
    twitter: "@melvinprince",
    github: "melvinprince",
    linkedin: "melvinprince",
    medium: "@melvinprince",
  },

  // SEO Defaults
  defaultKeywords: [
    "portfolio",
    "full stack developer",
    "web development",
    "react",
    "next.js",
    "typescript",
    "javascript",
    "frontend",
    "backend",
    "ui/ux",
    "modern web development",
    "responsive design",
    "accessibility",
    "performance optimization",
  ],

  // Structured Data
  organization: {
    name: "Modern Portfolio",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.example.com",
    logo: "/logo.png",
    contactPoint: {
      telephone: "+1-555-0123",
      contactType: "customer service",
      email: "contact@portfolio.example.com",
    },
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "true",
  },

  // Performance
  performance: {
    enableServiceWorker: true,
    enableWebVitals: true,
    enableLighthouse: true,
  },

  // Content
  blog: {
    mediumUsername: process.env.NEXT_PUBLIC_MEDIUM_USERNAME || "melvinprince",
    rssUrl: `https://medium.com/feed/@${
      process.env.NEXT_PUBLIC_MEDIUM_USERNAME || "melvinprince"
    }`,
  },

  // Contact
  contact: {
    email: "melvin@example.com",
    phone: "+1-555-0123",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
  },

  // SEO Enhancement
  seo: {
    enableJsonLd: true,
    enableBreadcrumbs: true,
    enableSitemap: true,
    enableRobots: true,
    enableCanonical: true,
    enableOpenGraph: true,
    enableTwitterCards: true,
    enableSchemaOrg: true,
  },

  // Page-specific SEO settings
  pages: {
    home: {
      title: "Modern Portfolio - Full Stack Developer",
      description:
        "Welcome to my portfolio showcasing modern web development projects, technical expertise in React, Next.js, TypeScript, and more. Explore my work and get in touch for collaboration opportunities.",
      keywords: [
        "portfolio home",
        "full stack developer",
        "web developer",
        "react developer",
        "next.js developer",
        "typescript developer",
        "frontend developer",
        "backend developer",
        "ui/ux developer",
        "modern web development",
        "responsive design",
        "accessibility",
        "performance optimization",
      ],
    },
    projects: {
      title: "Projects - Portfolio Showcase",
      description:
        "Explore my portfolio of web development projects including full-stack applications, interactive experiences, and modern web solutions built with React, Next.js, TypeScript, and more.",
      keywords: [
        "portfolio projects",
        "web development projects",
        "react projects",
        "next.js projects",
        "typescript projects",
        "full stack projects",
        "frontend projects",
        "backend projects",
        "javascript projects",
        "modern web applications",
        "responsive web design",
        "ui/ux projects",
        "open source projects",
      ],
    },
    tech: {
      title: "Tech Stack - Skills & Technologies",
      description:
        "Explore my technical expertise across frontend, backend, infrastructure, and data technologies. From React and TypeScript to Node.js and cloud platforms.",
      keywords: [
        "tech stack",
        "technical skills",
        "programming languages",
        "web technologies",
        "frontend technologies",
        "backend technologies",
        "react",
        "typescript",
        "javascript",
        "node.js",
        "next.js",
        "tailwind css",
        "database technologies",
        "cloud platforms",
        "devops tools",
        "development tools",
      ],
    },
    blog: {
      title: "Blog - Latest Articles & Insights",
      description:
        "Read my latest articles and insights on web development, technology trends, programming best practices, and software engineering experiences.",
      keywords: [
        "blog",
        "articles",
        "web development blog",
        "programming articles",
        "technology insights",
        "software engineering",
        "coding tutorials",
        "development tips",
        "tech trends",
        "programming best practices",
        "javascript articles",
        "react tutorials",
        "next.js guides",
        "typescript tips",
      ],
    },
    contact: {
      title: "Contact - Get in Touch",
      description:
        "Ready to collaborate? Get in touch to discuss your project, ask questions, or explore opportunities for working together on your next web development project.",
      keywords: [
        "contact",
        "get in touch",
        "hire developer",
        "freelance developer",
        "web development services",
        "collaboration",
        "project inquiry",
        "consultation",
        "full stack developer contact",
        "react developer hire",
        "next.js developer contact",
        "typescript developer",
      ],
    },
  },
} as const;

export type SEOConfig = typeof seoConfig;
