import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { contactRateLimiter } from "../rate-limiter";

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow requests within limit", () => {
    const key = "test-ip-1";

    // Should allow first 5 requests
    for (let i = 0; i < 5; i++) {
      expect(contactRateLimiter.isAllowed(key)).toBe(true);
    }
  });

  it("should block requests exceeding limit", () => {
    const key = "test-ip-2";

    // Use up all tokens
    for (let i = 0; i < 5; i++) {
      contactRateLimiter.isAllowed(key);
    }

    // Next request should be blocked
    expect(contactRateLimiter.isAllowed(key)).toBe(false);
  });

  it("should refill tokens over time", () => {
    const key = "test-ip-3";

    // Use up all tokens
    for (let i = 0; i < 5; i++) {
      contactRateLimiter.isAllowed(key);
    }

    // Should be blocked
    expect(contactRateLimiter.isAllowed(key)).toBe(false);

    // Advance time by 1 hour (should refill 1 token)
    vi.advanceTimersByTime(60 * 60 * 1000);

    // Should allow one more request
    expect(contactRateLimiter.isAllowed(key)).toBe(true);

    // But next should be blocked again
    expect(contactRateLimiter.isAllowed(key)).toBe(false);
  });

  it("should track remaining tokens correctly", () => {
    const key = "test-ip-4";

    expect(contactRateLimiter.getRemainingTokens(key)).toBe(5);

    contactRateLimiter.isAllowed(key);
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(4);

    contactRateLimiter.isAllowed(key);
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(3);
  });

  it("should calculate reset time correctly", () => {
    const key = "test-ip-5";
    const startTime = Date.now();

    // Use up all tokens
    for (let i = 0; i < 5; i++) {
      contactRateLimiter.isAllowed(key);
    }

    const resetTime = contactRateLimiter.getResetTime(key);

    // Reset time should be approximately 1 hour from now
    const expectedResetTime = startTime + 60 * 60 * 1000;
    expect(resetTime).toBeCloseTo(expectedResetTime, -3); // Within 1 second
  });

  it("should handle different keys independently", () => {
    const key1 = "test-ip-6";
    const key2 = "test-ip-7";

    // Use up tokens for key1
    for (let i = 0; i < 5; i++) {
      contactRateLimiter.isAllowed(key1);
    }

    // key1 should be blocked
    expect(contactRateLimiter.isAllowed(key1)).toBe(false);

    // key2 should still be allowed
    expect(contactRateLimiter.isAllowed(key2)).toBe(true);
  });

  it("should not exceed capacity when refilling", () => {
    const key = "test-ip-8";

    // Use one token
    contactRateLimiter.isAllowed(key);
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(4);

    // Advance time by 10 hours (should refill more than capacity)
    vi.advanceTimersByTime(10 * 60 * 60 * 1000);

    // Should not exceed capacity of 5
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(5);
  });

  it("should handle partial token refills", () => {
    const key = "test-ip-9";

    // Use all tokens
    for (let i = 0; i < 5; i++) {
      contactRateLimiter.isAllowed(key);
    }

    // Advance time by 30 minutes (should refill 0.5 tokens)
    vi.advanceTimersByTime(30 * 60 * 1000);

    // Should still be blocked (need at least 1 token)
    expect(contactRateLimiter.isAllowed(key)).toBe(false);

    // Advance another 30 minutes (total 1 hour, should have 1 token)
    vi.advanceTimersByTime(30 * 60 * 1000);

    // Should now be allowed
    expect(contactRateLimiter.isAllowed(key)).toBe(true);
  });

  it("should cleanup old buckets", () => {
    const key = "test-ip-cleanup";

    // Create a bucket
    contactRateLimiter.isAllowed(key);
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(4);

    // Advance time by more than 24 hours
    vi.advanceTimersByTime(25 * 60 * 60 * 1000);

    // Trigger cleanup
    contactRateLimiter.cleanup();

    // After cleanup, should have fresh bucket with full capacity
    expect(contactRateLimiter.getRemainingTokens(key)).toBe(5);
  });
});
