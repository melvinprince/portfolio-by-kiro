export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    medium?: string;
  };
  availability: {
    status: "available" | "busy" | "unavailable";
    message: string;
  };
}

export const personalInfo: PersonalInfo = {
  name: "Melvin Prince",
  role: "Full Stack Developer",
  tagline:
    "Building modern web experiences with performance and accessibility in mind",
  bio: "I'm a passionate full-stack developer with 5+ years of experience creating modern web applications. I specialize in React, Next.js, and TypeScript, with a strong focus on performance optimization, accessibility, and user experience. When I'm not coding, you'll find me contributing to open source projects, writing technical articles, or exploring the latest web technologies.",
  location: "San Francisco, CA",
  email: "melvin@example.com",
  social: {
    github: "https://github.com/melvinprince",
    linkedin: "https://linkedin.com/in/melvinprince",
    twitter: "https://twitter.com/melvinprince",
    medium: "https://medium.com/@melvinprince",
  },
  availability: {
    status: "available",
    message: "Open to new opportunities and interesting projects",
  },
};

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const experience: Experience[] = [
  {
    id: "1",
    company: "TechCorp Inc.",
    role: "Senior Frontend Developer",
    period: "2022 - Present",
    description:
      "Lead frontend development for a suite of SaaS applications serving 100k+ users. Architected and implemented design systems, performance optimizations, and accessibility improvements.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
    achievements: [
      "Improved application performance by 40% through code splitting and optimization",
      "Led migration from Create React App to Next.js, reducing build times by 60%",
      "Implemented comprehensive accessibility standards achieving WCAG AA compliance",
    ],
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    period: "2020 - 2022",
    description:
      "Built and maintained multiple web applications from concept to production. Worked closely with design and product teams to deliver user-centric solutions.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "AWS"],
    achievements: [
      "Developed 3 production applications serving 10k+ monthly active users",
      "Implemented real-time features using WebSocket connections",
      "Reduced server costs by 30% through optimization and caching strategies",
    ],
  },
  {
    id: "3",
    company: "Digital Agency Co.",
    role: "Frontend Developer",
    period: "2019 - 2020",
    description:
      "Created responsive websites and web applications for various clients. Focused on performance, SEO optimization, and cross-browser compatibility.",
    technologies: ["HTML", "CSS", "JavaScript", "Vue.js", "WordPress"],
    achievements: [
      "Delivered 15+ client projects with 100% on-time completion rate",
      "Achieved average Lighthouse scores of 95+ across all projects",
      "Implemented custom WordPress themes with advanced functionality",
    ],
  },
];

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
}

export const education: Education[] = [
  {
    id: "1",
    institution: "University of California, Berkeley",
    degree: "Bachelor of Science",
    field: "Computer Science",
    period: "2015 - 2019",
    description:
      "Focused on software engineering, algorithms, and web technologies. Graduated Magna Cum Laude with a 3.8 GPA.",
  },
];

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const certifications: Certification[] = [
  {
    id: "1",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialUrl: "https://aws.amazon.com/certification/",
  },
  {
    id: "2",
    name: "Google Analytics Certified",
    issuer: "Google",
    date: "2022",
  },
];
