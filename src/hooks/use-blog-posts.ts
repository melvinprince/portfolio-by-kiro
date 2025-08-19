"use client";

import { useState, useEffect } from "react";
import { BlogItem } from "@/app/api/blog/latest/route";

interface BlogResponse {
  success: boolean;
  data: BlogItem[];
  cached?: boolean;
  fallback?: boolean;
  error?: string;
  timestamp: number;
}

interface UseBlogPostsReturn {
  posts: BlogItem[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  isFallback: boolean;
  refetch: () => Promise<void>;
}

export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/blog/latest", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogResponse = await response.json();

      setPosts(data.data || []);
      setIsFromCache(data.cached || false);
      setIsFallback(data.fallback || false);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blog posts";
      setError(errorMessage);
      console.error("Blog fetch error:", err);

      // Set empty posts on error
      setPosts([]);
      setIsFromCache(false);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    isFromCache,
    isFallback,
    refetch,
  };
}
