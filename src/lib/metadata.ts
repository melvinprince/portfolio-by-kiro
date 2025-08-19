import type { Metadata } from "next";
import { seoConfig } from "./seo-config";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

const defaultConfig = {
  siteName: seoConfig.siteName,
  siteUrl: seoConfig.siteUrl,
  defaultImage: seoConfig.defaultOgImage,
  twitterHandle: seoConfig.social.twitter,
  locale: "en_US",
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    authors = ["Portfolio Owner"],
    section,
  } = config;

  const fullTitle = title.includes(defaultConfig.siteName)
    ? title
    : `${title} | ${defaultConfig.siteName}`;

  const canonicalUrl = url
    ? `${defaultConfig.siteUrl}${url}`
    : defaultConfig.siteUrl;
  const ogImage = image
    ? `${defaultConfig.siteUrl}${image}`
    : `${defaultConfig.siteUrl}${defaultConfig.defaultImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: authors.map((name) => ({ name })),
    creator: authors[0],
    publisher: defaultConfig.siteName,
    metadataBase: new URL(defaultConfig.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: defaultConfig.locale,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
    },
    twitter: {
      card: "summary_large_image",
      site: defaultConfig.twitterHandle,
      creator: defaultConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateProjectMetadata(project: {
  title: string;
  summary: string;
  slug: string;
  tech: string[];
  year: number;
}): Metadata {
  return generateMetadata({
    title: project.title,
    description: project.summary,
    keywords: [...project.tech, "project", "portfolio", "web development"],
    image: `/api/og/projects?title=${encodeURIComponent(
      project.title
    )}&tech=${encodeURIComponent(project.tech.join(","))}&year=${project.year}`,
    url: `/projects/${project.slug}`,
    type: "article",
    section: "Projects",
  });
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  keywords?: string[]
): Metadata {
  return generateMetadata({
    title,
    description,
    keywords,
    url: path,
    type: "website",
  });
}

export function generateBlogMetadata(blog: {
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  image?: string;
}): Metadata {
  return generateMetadata({
    title: blog.title,
    description: blog.description,
    keywords: [...seoConfig.defaultKeywords, "blog", "article"],
    image: blog.image,
    url: blog.url,
    type: "article",
    publishedTime: blog.publishedAt,
    section: "Blog",
  });
}

export function generateTechMetadata(): Metadata {
  const techPage = seoConfig.pages.tech;
  return generatePageMetadata(techPage.title, techPage.description, "/tech", [
    ...techPage.keywords,
  ]);
}

export function generateContactMetadata(): Metadata {
  const contactPage = seoConfig.pages.contact;
  return generatePageMetadata(
    contactPage.title,
    contactPage.description,
    "/contact",
    [...contactPage.keywords]
  );
}

export function generateProjectsMetadata(): Metadata {
  const projectsPage = seoConfig.pages.projects;
  return generatePageMetadata(
    projectsPage.title,
    projectsPage.description,
    "/projects",
    [...projectsPage.keywords]
  );
}

export function generateHomeMetadata(): Metadata {
  const homePage = seoConfig.pages.home;
  return generatePageMetadata(homePage.title, homePage.description, "/", [
    ...homePage.keywords,
  ]);
}

export function generateBlogPageMetadata(): Metadata {
  const blogPage = seoConfig.pages.blog;
  return generatePageMetadata(blogPage.title, blogPage.description, "/blog", [
    ...blogPage.keywords,
  ]);
}
