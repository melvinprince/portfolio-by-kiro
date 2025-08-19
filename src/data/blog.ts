export interface BlogPost {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  preview: string;
  readTime: string;
  tags: string[];
}

// Sample blog posts for when Medium RSS is not available or as fallback
export const sampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Performant React Applications in 2024",
    url: "https://medium.com/@melvinprince/building-performant-react-applications-2024",
    publishedAt: "2024-01-15",
    preview:
      "Explore the latest techniques for optimizing React applications, including concurrent features, code splitting, and performance monitoring strategies that can significantly improve your app's user experience.",
    readTime: "8 min read",
    tags: ["React", "Performance", "Web Development"],
  },
  {
    id: "2",
    title: "The Complete Guide to Next.js App Router",
    url: "https://medium.com/@melvinprince/complete-guide-nextjs-app-router",
    publishedAt: "2024-01-08",
    preview:
      "A comprehensive walkthrough of Next.js App Router, covering server components, streaming, and the new paradigms that make modern web development more efficient and user-friendly.",
    readTime: "12 min read",
    tags: ["Next.js", "React", "Server Components"],
  },
  {
    id: "3",
    title: "Accessibility-First Development: Beyond Compliance",
    url: "https://medium.com/@melvinprince/accessibility-first-development",
    publishedAt: "2023-12-22",
    preview:
      "Moving beyond basic WCAG compliance to create truly inclusive web experiences. Learn practical strategies for building accessible applications from the ground up.",
    readTime: "10 min read",
    tags: ["Accessibility", "UX", "Web Standards"],
  },
  {
    id: "4",
    title: "TypeScript Patterns for Scalable Applications",
    url: "https://medium.com/@melvinprince/typescript-patterns-scalable-apps",
    publishedAt: "2023-12-10",
    preview:
      "Advanced TypeScript patterns and techniques that help maintain code quality and developer productivity as your application grows in complexity and team size.",
    readTime: "15 min read",
    tags: ["TypeScript", "Architecture", "Best Practices"],
  },
  {
    id: "5",
    title: "Modern CSS: From Flexbox to Container Queries",
    url: "https://medium.com/@melvinprince/modern-css-flexbox-container-queries",
    publishedAt: "2023-11-28",
    preview:
      "Exploring the evolution of CSS layout techniques and how modern features like container queries are changing the way we approach responsive design.",
    readTime: "7 min read",
    tags: ["CSS", "Responsive Design", "Web Standards"],
  },
];

export const getLatestPosts = (limit: number = 3) =>
  sampleBlogPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);

export const getPostsByTag = (tag: string) =>
  sampleBlogPosts.filter((post) => post.tags.includes(tag));
