import { Metadata } from "next";
import { seoConfig } from "./seo-config";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateComprehensiveMetadata(data: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [seoConfig.author.name],
    section,
    noIndex = false,
    noFollow = false,
  } = data;

  const fullTitle = title.includes(seoConfig.siteName)
    ? title
    : `${title} | ${seoConfig.siteName}`;

  const canonicalUrl = url.startsWith("http")
    ? url
    : `${seoConfig.siteUrl}${url}`;

  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${seoConfig.siteUrl}${image}`
    : seoConfig.defaultOgImage;

  const allKeywords = [...new Set([...seoConfig.defaultKeywords, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.length > 0 ? allKeywords.join(", ") : undefined,
    authors: authors.map((name) => ({ name })),
    creator: authors[0],
    publisher: seoConfig.siteName,
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: seoConfig.siteName,
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
      site: seoConfig.social.twitter,
      creator: seoConfig.social.twitter,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: type === "article" ? "technology" : undefined,
  };
}

export function generatePageSEO(
  pageKey: keyof typeof seoConfig.pages,
  overrides?: Partial<SEOData>
): Metadata {
  const pageConfig = seoConfig.pages[pageKey];
  const path = pageKey === "home" ? "/" : `/${pageKey}`;

  return generateComprehensiveMetadata({
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: [...pageConfig.keywords],
    url: path,
    type: "website",
    ...overrides,
  });
}

export function generateArticleSEO(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  modifiedAt?: string;
  tags?: string[];
  image?: string;
}): Metadata {
  return generateComprehensiveMetadata({
    title: article.title,
    description: article.description,
    keywords: article.tags,
    url: `/blog/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    image: article.image,
    section: "Blog",
  });
}

export function generateProjectSEO(project: {
  title: string;
  summary: string;
  slug: string;
  tech: string[];
  year: number;
  publishedAt?: string;
}): Metadata {
  return generateComprehensiveMetadata({
    title: project.title,
    description: project.summary,
    keywords: [...project.tech, "project", "portfolio", "web development"],
    url: `/projects/${project.slug}`,
    type: "article",
    publishedTime: project.publishedAt || `${project.year}-01-01`,
    image: `/api/og/projects?title=${encodeURIComponent(
      project.title
    )}&tech=${encodeURIComponent(project.tech.join(","))}&year=${project.year}`,
    section: "Projects",
  });
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}

export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateWebPageJsonLd(page: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url.startsWith("http")
      ? page.url
      : `${seoConfig.siteUrl}${page.url}`,
    isPartOf: {
      "@type": "WebSite",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    ...(page.breadcrumbs && {
      breadcrumb: generateBreadcrumbJsonLd(page.breadcrumbs),
    }),
  };
}

export function combineStructuredData(...schemas: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
