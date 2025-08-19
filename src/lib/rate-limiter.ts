// Simple in-memory rate limiter using token bucket algorithm
interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per second
}

class RateLimiter {
  private buckets = new Map<string, TokenBucket>();
  private readonly capacity: number;
  private readonly refillRate: number;

  constructor(capacity: number = 5, refillRate: number = 1 / 3600) {
    // Default: 5 requests per hour (refillRate = 1 token per 3600 seconds)
    this.capacity = capacity;
    this.refillRate = refillRate;
  }

  private getBucket(key: string): TokenBucket {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefill: now,
        capacity: this.capacity,
        refillRate: this.refillRate,
      };
      this.buckets.set(key, bucket);
    }

    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * bucket.refillRate;
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    return bucket;
  }

  public isAllowed(key: string): boolean {
    const bucket = this.getBucket(key);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }

    return false;
  }

  public getRemainingTokens(key: string): number {
    const bucket = this.getBucket(key);
    return Math.floor(bucket.tokens);
  }

  public getResetTime(key: string): number {
    const bucket = this.getBucket(key);
    const tokensNeeded = 1 - bucket.tokens;
    const timeToRefill = (tokensNeeded / bucket.refillRate) * 1000; // milliseconds
    return Date.now() + timeToRefill;
  }

  // Clean up old buckets periodically
  public cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key);
      }
    }
  }
}

// Global rate limiter instance
export const contactRateLimiter = new RateLimiter(5, 1 / 3600); // 5 requests per hour

// Cleanup old buckets every hour
if (typeof window === "undefined") {
  setInterval(() => {
    contactRateLimiter.cleanup();
  }, 60 * 60 * 1000);
}
