import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "../route";

// Mock dependencies
vi.mock("@/lib/contact-schema", () => ({
  contactFormSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock("@/lib/rate-limiter", () => ({
  contactRateLimiter: {
    isAllowed: vi.fn(),
    getResetTime: vi.fn(),
  },
}));

vi.mock("@/lib/email-service", () => ({
  EmailService: {
    getInstance: vi.fn(() => ({
      sendContactEmail: vi.fn(),
      sendConfirmationEmail: vi.fn(),
    })),
  },
}));

const { contactFormSchema } = await import("@/lib/contact-schema");
const { contactRateLimiter } = await import("@/lib/rate-limiter");
const { EmailService } = await import("@/lib/email-service");

describe("/api/contact", () => {
  let mockEmailService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailService = {
      sendContactEmail: vi.fn(),
      sendConfirmationEmail: vi.fn(),
    };
    vi.mocked(EmailService.getInstance).mockReturnValue(mockEmailService);
  });

  describe("POST", () => {
    it("should handle successful form submission", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
        website: "",
        sendCopy: false,
      };

      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: true,
        data: formData,
      });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Message sent successfully");
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(formData);
    });

    it("should handle rate limiting", async () => {
      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(false);
      vi.mocked(contactRateLimiter.getResetTime).mockReturnValue(
        Date.now() + 60000
      );

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain("Rate limit exceeded");
      expect(data.code).toBe("RATE_LIMIT_EXCEEDED");
    });

    it("should handle validation errors", async () => {
      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "Name is required" }],
        },
      });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid form data");
      expect(data.code).toBe("VALIDATION_ERROR");
    });

    it("should handle honeypot spam detection", async () => {
      const formData = {
        name: "Spammer",
        email: "spam@example.com",
        message: "Spam message",
        website: "http://spam.com", // Honeypot field filled
        sendCopy: false,
      };

      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: true,
        data: formData,
      });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockEmailService.sendContactEmail).not.toHaveBeenCalled();
    });

    it("should handle email sending errors", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
        website: "",
        sendCopy: false,
      };

      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: true,
        data: formData,
      });
      mockEmailService.sendContactEmail.mockRejectedValue(
        new Error("Email failed")
      );

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Failed to send message. Please try again later."
      );
      expect(data.code).toBe("EMAIL_SEND_ERROR");
    });

    it("should send confirmation email when requested", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
        website: "",
        sendCopy: true,
      };

      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: true,
        data: formData,
      });

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(formData);
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        formData
      );
    });

    it("should handle confirmation email errors gracefully", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
        website: "",
        sendCopy: true,
      };

      vi.mocked(contactRateLimiter.isAllowed).mockReturnValue(true);
      vi.mocked(contactFormSchema.safeParse).mockReturnValue({
        success: true,
        data: formData,
      });
      mockEmailService.sendConfirmationEmail.mockRejectedValue(
        new Error("Confirmation failed")
      );

      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(formData);
    });
  });

  describe("GET", () => {
    it("should return method not allowed", async () => {
      const request = new NextRequest("http://localhost:3000/api/contact", {
        method: "GET",
      });

      const response = await GET(request);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toBe("Method not allowed");
    });
  });
});
