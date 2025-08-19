"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { motionTransitions } from "@/lib/motion-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import type { BlogItem } from "@/app/api/blog/latest/route";

interface BlogTeaserProps {
  className?: string;
}

function BlogPostSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded mb-2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function BlogPostCard({ post, index }: { post: BlogItem; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ...motionTransitions.default,
        delay: index * 0.1,
      },
    },
    hover: {
      y: -4,
      transition: motionTransitions.fast,
    },
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (prefersReducedMotion) {
    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-colors line-clamp-2">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {post.title}
            </a>
          </CardTitle>
          <CardDescription>
            {formatDate(post.publishedAt)} • {calculateReadTime(post.preview)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.preview}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className="group hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-colors line-clamp-2">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {post.title}
            </a>
          </CardTitle>
          <CardDescription>
            {formatDate(post.publishedAt)} • {calculateReadTime(post.preview)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.preview}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function BlogTeaser({ className }: BlogTeaserProps) {
  const prefersReducedMotion = useReducedMotion();
  const { posts, loading } = useBlogPosts();

  // Show only the latest 2 posts for the home page teaser
  const latestPosts = posts.slice(0, 2);

  const sectionVariants = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: motionTransitions.default,
    },
  };

  if (prefersReducedMotion) {
    return (
      <section className={`py-16 ${className || ""}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Latest Posts
          </h2>
          <p className="text-muted-foreground">Recent thoughts and tutorials</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {loading ? (
            <>
              <BlogPostSkeleton />
              <BlogPostSkeleton />
            </>
          ) : (
            latestPosts.map((post, index) => (
              <BlogPostCard
                key={`${post.url}-${index}`}
                post={post}
                index={index}
              />
            ))
          )}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-accent hover:underline"
          >
            Read more posts →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${className || ""}`}>
      <motion.div
        className="text-center mb-12"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Latest Posts
        </h2>
        <p className="text-muted-foreground">Recent thoughts and tutorials</p>
      </motion.div>

      <StaggerContainer className="grid md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <>
            <StaggerItem>
              <BlogPostSkeleton />
            </StaggerItem>
            <StaggerItem>
              <BlogPostSkeleton />
            </StaggerItem>
          </>
        ) : (
          latestPosts.map((post, index) => (
            <StaggerItem key={`${post.url}-${index}`}>
              <BlogPostCard post={post} index={index} />
            </StaggerItem>
          ))
        )}
      </StaggerContainer>

      <motion.div
        className="text-center"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <Link
          href="/blog"
          className="inline-flex items-center text-accent hover:underline"
        >
          Read more posts →
        </Link>
      </motion.div>
    </section>
  );
}
