import { NextRequest, NextResponse } from "next/server";
import { sampleBlogPosts } from "@/data/blog";
import {
  memoryCache,
  cacheKeys,
  CACHE_HEADERS,
  createCachedResponse,
} from "@/lib/cache";

export interface BlogItem {
  title: string;
  url: string;
  publishedAt: string;
  preview: string;
}

const CACHE_DURATION = 1800; // 30 minutes in seconds
const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME || "melvinprince";

async function parseRSSFeed(username: string): Promise<BlogItem[]> {
  try {
    const rssUrl = `https://medium.com/feed/@${username}`;
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Portfolio RSS Reader)",
      },
      next: { revalidate: 1800 }, // 30 minutes
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const rssText = await response.text();

    // Parse RSS XML
    const items = parseRSSItems(rssText);
    return items;
  } catch (error) {
    console.error("RSS parsing error:", error);
    throw error;
  }
}

function parseRSSItems(rssText: string): BlogItem[] {
  const items: BlogItem[] = [];

  try {
    // Extract items using regex (simple XML parsing)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    const descriptionRegex =
      /<description><!\[CDATA\[(.*?)\]\]><\/description>/;

    let match;
    while ((match = itemRegex.exec(rssText)) !== null && items.length < 10) {
      const itemContent = match[1];

      const titleMatch = titleRegex.exec(itemContent);
      const linkMatch = linkRegex.exec(itemContent);
      const pubDateMatch = pubDateRegex.exec(itemContent);
      const descriptionMatch = descriptionRegex.exec(itemContent);

      if (titleMatch && linkMatch && pubDateMatch) {
        const title = titleMatch[1];
        const url = linkMatch[1];
        const publishedAt = new Date(pubDateMatch[1]).toISOString();

        // Extract preview from description (remove HTML tags and limit length)
        let preview = "";
        if (descriptionMatch) {
          preview =
            descriptionMatch[1]
              .replace(/<[^>]*>/g, "") // Remove HTML tags
              .replace(/&[^;]+;/g, " ") // Remove HTML entities
              .trim()
              .substring(0, 200) + "...";
        }

        items.push({
          title,
          url,
          publishedAt,
          preview: preview || "Read more on Medium...",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("RSS XML parsing error:", error);
    return [];
  }
}

function getFallbackData(): BlogItem[] {
  return sampleBlogPosts.slice(0, 5).map((post) => ({
    title: post.title,
    url: post.url,
    publishedAt: post.publishedAt,
    preview: post.preview,
  }));
}

export async function GET(_request: NextRequest) {
  try {
    const cacheKey = cacheKeys.blogPosts();

    // Check memory cache first
    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      return createCachedResponse(
        {
          success: true,
          data: cachedData,
          cached: true,
          timestamp: Date.now(),
        },
        CACHE_HEADERS.BLOG_DATA
      );
    }

    // Try to fetch fresh RSS data
    try {
      const rssData = await parseRSSFeed(MEDIUM_USERNAME);

      if (rssData.length > 0) {
        // Cache the fresh data
        memoryCache.set(cacheKey, rssData, CACHE_DURATION);

        return createCachedResponse(
          {
            success: true,
            data: rssData,
            cached: false,
            timestamp: Date.now(),
          },
          CACHE_HEADERS.BLOG_DATA
        );
      }
    } catch (rssError) {
      console.error("RSS fetch failed, using fallback:", rssError);
    }

    // If RSS fails, use fallback data but don't cache it
    const fallbackData = getFallbackData();

    return createCachedResponse(
      {
        success: true,
        data: fallbackData,
        cached: false,
        fallback: true,
        timestamp: Date.now(),
      },
      CACHE_HEADERS.BLOG_DATA
    );
  } catch (error) {
    console.error("Blog API error:", error);

    // Return fallback data on any error
    const fallbackData = getFallbackData();

    return new Response(
      JSON.stringify({
        success: false,
        data: fallbackData,
        error: "Failed to fetch blog posts",
        fallback: true,
        timestamp: Date.now(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CACHE_HEADERS.NO_CACHE,
        },
      }
    );
  }
}

// Optional: Add revalidation endpoint
export async function POST(_request: NextRequest) {
  try {
    // Clear cache to force refresh
    const cacheKey = cacheKeys.blogPosts();
    memoryCache.delete(cacheKey);

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
      },
      { status: 500 }
    );
  }
}
