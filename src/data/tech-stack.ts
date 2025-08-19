export interface TechItem {
  name: string;
  level: "learning" | "intermediate" | "advanced" | "expert";
  useCases: string[];
  since: number;
  site?: string;
  domain: "frontend" | "backend" | "infrastructure" | "data" | "tools";
  description: string;
}

export const techStack: TechItem[] = [
  // Frontend
  {
    name: "React",
    level: "expert",
    useCases: [
      "Single Page Applications",
      "Component Libraries",
      "Interactive UIs",
    ],
    since: 2020,
    site: "https://react.dev",
    domain: "frontend",
    description:
      "Primary framework for building modern web applications with hooks and context",
  },
  {
    name: "Next.js",
    level: "expert",
    useCases: [
      "Full-stack Applications",
      "Static Sites",
      "Server-side Rendering",
    ],
    since: 2021,
    site: "https://nextjs.org",
    domain: "frontend",
    description:
      "Go-to framework for production React applications with App Router and RSC",
  },
  {
    name: "TypeScript",
    level: "advanced",
    useCases: ["Type Safety", "Large Applications", "Team Development"],
    since: 2021,
    site: "https://typescriptlang.org",
    domain: "frontend",
    description:
      "Essential for maintaining code quality and developer experience in complex projects",
  },
  {
    name: "Vue.js",
    level: "intermediate",
    useCases: [
      "Progressive Enhancement",
      "Component-based UIs",
      "Rapid Prototyping",
    ],
    since: 2022,
    site: "https://vuejs.org",
    domain: "frontend",
    description:
      "Alternative framework for building reactive user interfaces with excellent DX",
  },
  {
    name: "Tailwind CSS",
    level: "expert",
    useCases: ["Rapid Styling", "Design Systems", "Responsive Design"],
    since: 2021,
    site: "https://tailwindcss.com",
    domain: "frontend",
    description:
      "Utility-first CSS framework for building custom designs without leaving HTML",
  },
  {
    name: "Framer Motion",
    level: "advanced",
    useCases: ["Page Transitions", "Micro-interactions", "Complex Animations"],
    since: 2022,
    site: "https://framer.com/motion",
    domain: "frontend",
    description:
      "Production-ready motion library for React with declarative animations",
  },
  {
    name: "GSAP",
    level: "intermediate",
    useCases: [
      "Scroll Animations",
      "Timeline Sequences",
      "Performance-critical Animations",
    ],
    since: 2023,
    site: "https://gsap.com",
    domain: "frontend",
    description:
      "High-performance animation library for complex scroll-triggered animations",
  },

  // Backend
  {
    name: "Node.js",
    level: "advanced",
    useCases: [
      "API Development",
      "Server-side Logic",
      "Real-time Applications",
    ],
    since: 2020,
    site: "https://nodejs.org",
    domain: "backend",
    description:
      "JavaScript runtime for building scalable server-side applications",
  },
  {
    name: "Express.js",
    level: "advanced",
    useCases: ["REST APIs", "Middleware", "Web Servers"],
    since: 2020,
    site: "https://expressjs.com",
    domain: "backend",
    description: "Minimal and flexible Node.js web application framework",
  },
  {
    name: "Python",
    level: "intermediate",
    useCases: ["Data Processing", "API Development", "Automation Scripts"],
    since: 2019,
    site: "https://python.org",
    domain: "backend",
    description:
      "Versatile language for backend development and data processing tasks",
  },
  {
    name: "FastAPI",
    level: "intermediate",
    useCases: [
      "High-performance APIs",
      "Automatic Documentation",
      "Type Validation",
    ],
    since: 2023,
    site: "https://fastapi.tiangolo.com",
    domain: "backend",
    description:
      "Modern Python framework for building APIs with automatic OpenAPI documentation",
  },

  // Infrastructure
  {
    name: "Vercel",
    level: "advanced",
    useCases: ["Next.js Deployment", "Serverless Functions", "Edge Computing"],
    since: 2021,
    site: "https://vercel.com",
    domain: "infrastructure",
    description: "Platform for deploying and scaling modern web applications",
  },
  {
    name: "AWS",
    level: "intermediate",
    useCases: [
      "Cloud Infrastructure",
      "Serverless Computing",
      "Storage Solutions",
    ],
    since: 2022,
    site: "https://aws.amazon.com",
    domain: "infrastructure",
    description: "Cloud platform for scalable infrastructure and services",
  },
  {
    name: "Docker",
    level: "intermediate",
    useCases: ["Containerization", "Development Environment", "Deployment"],
    since: 2022,
    site: "https://docker.com",
    domain: "infrastructure",
    description:
      "Containerization platform for consistent development and deployment environments",
  },
  {
    name: "Cloudflare",
    level: "intermediate",
    useCases: ["CDN", "DNS Management", "Edge Functions"],
    since: 2023,
    site: "https://cloudflare.com",
    domain: "infrastructure",
    description: "Global network for performance, security, and reliability",
  },

  // Data
  {
    name: "PostgreSQL",
    level: "intermediate",
    useCases: ["Relational Data", "Complex Queries", "ACID Transactions"],
    since: 2021,
    site: "https://postgresql.org",
    domain: "data",
    description:
      "Advanced open-source relational database with excellent performance",
  },
  {
    name: "MongoDB",
    level: "intermediate",
    useCases: ["Document Storage", "Flexible Schema", "Real-time Applications"],
    since: 2022,
    site: "https://mongodb.com",
    domain: "data",
    description: "NoSQL database for flexible, scalable data storage",
  },
  {
    name: "Prisma",
    level: "advanced",
    useCases: ["Database ORM", "Type Safety", "Schema Management"],
    since: 2022,
    site: "https://prisma.io",
    domain: "data",
    description:
      "Next-generation ORM with type safety and excellent developer experience",
  },
  {
    name: "Redis",
    level: "learning",
    useCases: ["Caching", "Session Storage", "Real-time Features"],
    since: 2024,
    site: "https://redis.io",
    domain: "data",
    description:
      "In-memory data structure store for caching and real-time applications",
  },

  // Tools
  {
    name: "Git",
    level: "advanced",
    useCases: ["Version Control", "Collaboration", "Code History"],
    since: 2019,
    site: "https://git-scm.com",
    domain: "tools",
    description: "Distributed version control system for tracking code changes",
  },
  {
    name: "VS Code",
    level: "expert",
    useCases: ["Code Editing", "Debugging", "Extension Ecosystem"],
    since: 2019,
    site: "https://code.visualstudio.com",
    domain: "tools",
    description:
      "Primary code editor with excellent TypeScript and React support",
  },
  {
    name: "Figma",
    level: "intermediate",
    useCases: ["UI Design", "Prototyping", "Design Systems"],
    since: 2021,
    site: "https://figma.com",
    domain: "tools",
    description:
      "Collaborative design tool for creating user interfaces and prototypes",
  },
  {
    name: "Postman",
    level: "intermediate",
    useCases: ["API Testing", "Documentation", "Collaboration"],
    since: 2020,
    site: "https://postman.com",
    domain: "tools",
    description: "Platform for API development, testing, and documentation",
  },
];

export const getTechByDomain = (domain: TechItem["domain"]) =>
  techStack.filter((tech) => tech.domain === domain);

export const getTechByLevel = (level: TechItem["level"]) =>
  techStack.filter((tech) => tech.level === level);

export const getFeaturedTech = () =>
  techStack.filter(
    (tech) => tech.level === "expert" || tech.level === "advanced"
  );

export const techDomains = [
  {
    key: "frontend" as const,
    label: "Frontend",
    description: "User interface and experience",
  },
  {
    key: "backend" as const,
    label: "Backend",
    description: "Server-side development",
  },
  {
    key: "infrastructure" as const,
    label: "Infrastructure",
    description: "Deployment and scaling",
  },
  { key: "data" as const, label: "Data", description: "Databases and storage" },
  {
    key: "tools" as const,
    label: "Tools",
    description: "Development workflow",
  },
];
