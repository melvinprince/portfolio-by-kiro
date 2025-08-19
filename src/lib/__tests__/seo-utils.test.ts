import { describe, it, expect, vi } from "vitest";
import {
  generateComprehensiveMetadata,
  generatePageSEO,
  generateArticleSEO,
  generateProjectSEO,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateWebPageJsonLd,
  combineStructuredData,
  type SEOData,
} from "../seo-utils";

// Mock seo-config
vi.mock("../seo-config", () => ({
  seoConfig: {
    siteName: "Test Portfolio",
    siteUrl: "https://example.com",
    defaultOgImage: "https://example.com/og-default.png",
    defaultKeywords: ["portfolio", "developer"],
    author: {
      name: "John Doe",
    },
    social: {
      twitter: "@johndoe",
    },
    pages: {
      home: {
        title: "Home",
        description: "Welcome to my portfolio",
        keywords: ["home", "portfolio"],
      },
      projects: {
        title: "Projects",
        description: "My projects",
        keywords: ["projects", "work"],
      },
    },
  },
}));

describe("seo-utils", () => {
  describe("generateComprehensiveMetadata", () => {
    it("should generate basic metadata", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "/test",
      };

      const metadata = generateComprehensiveMetadata(data);

      expect(metadata.title).toBe("Test Page | Test Portfolio");
      expect(metadata.description).toBe("Test description");
      expect(metadata.alternates?.canonical).toBe("https://example.com/test");
    });

    it("should handle full URLs", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "https://example.com/test",
      };

      const metadata = generateComprehensiveMetadata(data);
      expect(metadata.alternates?.canonical).toBe("https://example.com/test");
    });

    it("should generate OpenGraph metadata", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "/test",
        image: "/test-image.jpg",
        type: "article",
      };

      const metadata = generateComprehensiveMetadata(data);

      expect(metadata.openGraph).toMatchObject({
        type: "article",
        title: "Test Page | Test Portfolio",
        description: "Test description",
        siteName: "Test Portfolio",
        url: "https://example.com/test",
      });
    });

    it("should generate Twitter metadata", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "/test",
      };

      const metadata = generateComprehensiveMetadata(data);

      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        site: "@johndoe",
        creator: "@johndoe",
        title: "Test Page | Test Portfolio",
        description: "Test description",
      });
    });

    it("should handle noIndex and noFollow", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "/test",
        noIndex: true,
        noFollow: true,
      };

      const metadata = generateComprehensiveMetadata(data);

      expect(metadata.robots).toMatchObject({
        index: false,
        follow: false,
      });
    });

    it("should merge keywords correctly", () => {
      const data: SEOData = {
        title: "Test Page",
        description: "Test description",
        url: "/test",
        keywords: ["test", "page"],
      };

      const metadata = generateComprehensiveMetadata(data);
      expect(metadata.keywords).toContain("portfolio");
      expect(metadata.keywords).toContain("developer");
      expect(metadata.keywords).toContain("test");
      expect(metadata.keywords).toContain("page");
    });
  });

  describe("generatePageSEO", () => {
    it("should generate SEO for home page", () => {
      const metadata = generatePageSEO("home");

      expect(metadata.title).toBe("Home | Test Portfolio");
      expect(metadata.description).toBe("Welcome to my portfolio");
      expect(metadata.alternates?.canonical).toBe("https://example.com/");
    });

    it("should generate SEO for other pages", () => {
      const metadata = generatePageSEO("projects");

      expect(metadata.title).toBe("Projects | Test Portfolio");
      expect(metadata.description).toBe("My projects");
      expect(metadata.alternates?.canonical).toBe(
        "https://example.com/projects"
      );
    });

    it("should apply overrides", () => {
      const metadata = generatePageSEO("home", {
        title: "Custom Title",
        keywords: ["custom"],
      });

      expect(metadata.title).toBe("Custom Title | Test Portfolio");
    });
  });

  describe("generateArticleSEO", () => {
    it("should generate article SEO", () => {
      const article = {
        title: "Test Article",
        description: "Test article description",
        slug: "test-article",
        publishedAt: "2023-01-01",
        tags: ["test", "article"],
      };

      const metadata = generateArticleSEO(article);

      expect(metadata.title).toBe("Test Article | Test Portfolio");
      expect(metadata.alternates?.canonical).toBe(
        "https://example.com/blog/test-article"
      );
      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.openGraph?.publishedTime).toBe("2023-01-01");
    });
  });

  describe("generateProjectSEO", () => {
    it("should generate project SEO", () => {
      const project = {
        title: "Test Project",
        summary: "Test project summary",
        slug: "test-project",
        tech: ["React", "TypeScript"],
        year: 2023,
      };

      const metadata = generateProjectSEO(project);

      expect(metadata.title).toBe("Test Project | Test Portfolio");
      expect(metadata.alternates?.canonical).toBe(
        "https://example.com/projects/test-project"
      );
      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.keywords).toContain("React");
      expect(metadata.keywords).toContain("TypeScript");
    });
  });

  describe("generateBreadcrumbJsonLd", () => {
    it("should generate breadcrumb JSON-LD", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: "Test Project", url: "/projects/test" },
      ];

      const jsonLd = generateBreadcrumbJsonLd(items);

      expect(jsonLd["@type"]).toBe("BreadcrumbList");
      expect(jsonLd.itemListElement).toHaveLength(3);
      expect(jsonLd.itemListElement[0]).toMatchObject({
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://example.com/",
      });
    });
  });

  describe("generateFAQJsonLd", () => {
    it("should generate FAQ JSON-LD", () => {
      const faqs = [
        { question: "What is this?", answer: "This is a test." },
        { question: "How does it work?", answer: "It works well." },
      ];

      const jsonLd = generateFAQJsonLd(faqs);

      expect(jsonLd["@type"]).toBe("FAQPage");
      expect(jsonLd.mainEntity).toHaveLength(2);
      expect(jsonLd.mainEntity[0]).toMatchObject({
        "@type": "Question",
        name: "What is this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This is a test.",
        },
      });
    });
  });

  describe("generateWebPageJsonLd", () => {
    it("should generate WebPage JSON-LD", () => {
      const page = {
        name: "Test Page",
        description: "Test page description",
        url: "/test",
      };

      const jsonLd = generateWebPageJsonLd(page);

      expect(jsonLd["@type"]).toBe("WebPage");
      expect(jsonLd.name).toBe("Test Page");
      expect(jsonLd.url).toBe("https://example.com/test");
      expect(jsonLd.isPartOf).toMatchObject({
        "@type": "WebSite",
        name: "Test Portfolio",
        url: "https://example.com",
      });
    });

    it("should include breadcrumbs when provided", () => {
      const page = {
        name: "Test Page",
        description: "Test page description",
        url: "/test",
        breadcrumbs: [
          { name: "Home", url: "/" },
          { name: "Test", url: "/test" },
        ],
      };

      const jsonLd = generateWebPageJsonLd(page);
      expect(jsonLd.breadcrumb).toBeDefined();
    });
  });

  describe("combineStructuredData", () => {
    it("should combine multiple schemas", () => {
      const schema1 = { "@type": "Person", name: "John" };
      const schema2 = { "@type": "Organization", name: "Company" };

      const combined = combineStructuredData(schema1, schema2);

      expect(combined["@context"]).toBe("https://schema.org");
      expect(combined["@graph"]).toEqual([schema1, schema2]);
    });
  });
});
