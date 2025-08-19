/**
 * Caching utilities and strategies
 */

// Cache durations in seconds
export const CACHE_DURATIONS = {
  STATIC_ASSETS: 31536000, // 1 year
  IMAGES: 31536000, // 1 year
  API_DATA: 3600, // 1 hour
  BLOG_DATA: 1800, // 30 minutes
  PROJECT_DATA: 86400, // 1 day
  CONTACT_FORM: 0, // No cache
} as const;

/**
 * Generate cache control headers
 */
export function getCacheHeaders(
  duration: number,
  options: {
    public?: boolean;
    immutable?: boolean;
    staleWhileRevalidate?: number;
    mustRevalidate?: boolean;
  } = {}
) {
  const {
    public: isPublic = true,
    immutable = false,
    staleWhileRevalidate,
    mustRevalidate = false,
  } = options;

  const directives = [isPublic ? "public" : "private", `max-age=${duration}`];

  if (immutable) {
    directives.push("immutable");
  }

  if (staleWhileRevalidate) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }

  if (mustRevalidate) {
    directives.push("must-revalidate");
  }

  return {
    "Cache-Control": directives.join(", "),
  };
}

/**
 * Cache headers for different content types
 */
export const CACHE_HEADERS = {
  STATIC_ASSETS: getCacheHeaders(CACHE_DURATIONS.STATIC_ASSETS, {
    immutable: true,
  }),
  IMAGES: getCacheHeaders(CACHE_DURATIONS.IMAGES, {
    immutable: true,
    staleWhileRevalidate: 86400, // 1 day
  }),
  API_DATA: getCacheHeaders(CACHE_DURATIONS.API_DATA, {
    staleWhileRevalidate: 3600, // 1 hour
  }),
  BLOG_DATA: getCacheHeaders(CACHE_DURATIONS.BLOG_DATA, {
    staleWhileRevalidate: 1800, // 30 minutes
  }),
  PROJECT_DATA: getCacheHeaders(CACHE_DURATIONS.PROJECT_DATA, {
    staleWhileRevalidate: 86400, // 1 day
  }),
  NO_CACHE: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
} as const;

/**
 * In-memory cache for API responses
 */
class MemoryCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 3600) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Cleanup expired entries every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  blogPosts: () => "blog:posts",
  blogPost: (slug: string) => `blog:post:${slug}`,
  projects: () => "projects:all",
  project: (slug: string) => `project:${slug}`,
  techStack: () => "tech:stack",
  contactForm: (ip: string) => `contact:${ip}`,
} as const;

/**
 * Response wrapper with caching
 */
export function createCachedResponse(
  data: any,
  cacheHeaders: Record<string, string> = CACHE_HEADERS.API_DATA
) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...cacheHeaders,
    },
  });
}

/**
 * Cached fetch wrapper
 */
export async function cachedFetch(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl: number = 3600
) {
  const key = cacheKey || `fetch:${url}`;

  // Check memory cache first
  const cached = memoryCache.get(key);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    memoryCache.set(key, data, ttl);

    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

/**
 * Service Worker cache strategies (for client-side)
 */
export const SW_CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
  NETWORK_ONLY: "network-only",
  CACHE_ONLY: "cache-only",
} as const;

/**
 * Generate service worker cache configuration
 */
export function generateSWCacheConfig() {
  return {
    // Static assets - cache first
    staticAssets: {
      urlPattern: /\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/,
      handler: SW_CACHE_STRATEGIES.CACHE_FIRST,
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: CACHE_DURATIONS.STATIC_ASSETS,
        },
      },
    },

    // API routes - network first with fallback
    apiRoutes: {
      urlPattern: /^\/api\//,
      handler: SW_CACHE_STRATEGIES.NETWORK_FIRST,
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: CACHE_DURATIONS.API_DATA,
        },
      },
    },

    // Pages - stale while revalidate
    pages: {
      urlPattern: /^\/(?!api)/,
      handler: SW_CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: CACHE_DURATIONS.PROJECT_DATA,
        },
      },
    },
  };
}
