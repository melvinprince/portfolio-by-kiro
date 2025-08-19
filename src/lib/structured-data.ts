import type { Person, CreativeWork, WebSite, Organization } from "schema-dts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.example.com";

export function generatePersonSchema(): Person {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Melvin Prince",
    alternateName: ["Full Stack Developer", "Web Developer"],
    description:
      "Full Stack Developer specializing in modern web technologies including React, Next.js, TypeScript, and Node.js",
    url: siteUrl,
    image: `${siteUrl}/api/og?title=Melvin Prince&subtitle=Full Stack Developer`,
    sameAs: [
      "https://github.com/melvinprince",
      "https://linkedin.com/in/melvinprince",
      "https://twitter.com/melvinprince",
      "https://medium.com/@melvinprince",
    ],
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Web Development",
      "Frontend Development",
      "Backend Development",
      "UI/UX Design",
      "Performance Optimization",
      "Accessibility",
      "SEO",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "University Name",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "United States",
    },
    email: "melvin@example.com",
    telephone: "+1-555-0123",
  };
}

export function generateWebSiteSchema(): WebSite {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Melvin Prince - Portfolio",
    description:
      "A fast, accessible, visually rich personal portfolio showcasing modern web development projects, technical expertise, and professional experience.",
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/projects?q={search_term_string}`,
      },
      // Note: query-input is not part of schema.org but used by Google
      // "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

export function generateOrganizationSchema(): Organization {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Modern Portfolio",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/api/og?title=Modern Portfolio&subtitle=Full Stack Developer`,
    description:
      "Professional portfolio showcasing modern web development expertise",
    founder: {
      "@id": `${siteUrl}/#person`,
    },
    sameAs: [
      "https://github.com/portfolio-owner",
      "https://linkedin.com/in/portfolio-owner",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-0123",
      contactType: "customer service",
      email: "contact@portfolio.example.com",
      availableLanguage: ["English"],
    },
  };
}

export function generateProjectSchema(project: {
  title: string;
  summary: string;
  slug: string;
  tech: string[];
  year: number;
  liveUrl?: string;
  repoUrl?: string;
}): CreativeWork {
  return {
    "@type": "CreativeWork",
    "@id": `${siteUrl}/projects/${project.slug}#creativework`,
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    image: `${siteUrl}/api/og/projects?title=${encodeURIComponent(
      project.title
    )}&tech=${encodeURIComponent(project.tech.join(","))}&year=${project.year}`,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    creator: {
      "@id": `${siteUrl}/#person`,
    },
    dateCreated: `${project.year}-01-01`,
    datePublished: `${project.year}-01-01`,
    inLanguage: "en-US",
    keywords: project.tech.join(", "),
    genre: "Web Development",
    about: project.tech.map((tech) => ({
      "@type": "Thing",
      name: tech,
    })),
    ...(project.liveUrl && {
      mainEntityOfPage: project.liveUrl,
    }),
    ...(project.repoUrl && {
      codeRepository: project.repoUrl,
    }),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateStructuredData(schemas: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
