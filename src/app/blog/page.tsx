import type { Metadata } from "next";
import { BlogPageContent } from "./blog-page-content";
import { generateBlogPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateBlogPageMetadata();

export default function BlogPage() {
  return <BlogPageContent />;
}
