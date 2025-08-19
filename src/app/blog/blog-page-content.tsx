"use client";

import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, Rss, ExternalLink } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogGridSkeleton } from "@/components/blog/blog-card-skeleton";
import { useBlogPosts } from "@/hooks/use-blog-posts";

export function BlogPageContent() {
  const { posts, loading, error, isFromCache, isFallback, refetch } =
    useBlogPosts();

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thoughts, tutorials, and insights about web development, technology,
          and the craft of building great software.
        </p>
      </motion.div>

      {/* Status Indicator */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
                    RSS Feed Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}. Showing fallback content.
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label="Retry fetching blog posts"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isFallback ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Using Sample Content
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Medium RSS feed is not available. Showing sample blog posts.
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  aria-label="Retry fetching blog posts"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Rss className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
                    Live from Medium RSS
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {isFromCache
                      ? "Showing cached content (updates every 30 minutes)"
                      : "Fresh content loaded from Medium RSS feed"}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  aria-label="Refresh blog posts"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Blog Posts */}
      {loading ? (
        <BlogGridSkeleton count={5} />
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <BlogCard
              key={`${post.url}-${index}`}
              title={post.title}
              url={post.url}
              publishedAt={post.publishedAt}
              preview={post.preview}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <Rss className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Blog Posts Found
            </h3>
            <p className="text-muted-foreground mb-4">
              Unable to load blog posts at this time. Please try again later.
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Medium Profile Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16 p-8 bg-muted/50 rounded-lg"
      >
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Follow me on Medium
        </h3>
        <p className="text-muted-foreground mb-4">
          Get notified when I publish new articles about web development,
          technology, and programming best practices.
        </p>
        <a
          href={`https://medium.com/@${
            process.env.NEXT_PUBLIC_MEDIUM_USERNAME || "melvinprince"
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
          </svg>
          Follow on Medium
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}
