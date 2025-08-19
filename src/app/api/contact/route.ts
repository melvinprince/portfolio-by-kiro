import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import { contactRateLimiter } from "@/lib/rate-limiter";
import { EmailService } from "@/lib/email-service";

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to unknown if no IP can be determined
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!contactRateLimiter.isAllowed(clientIP)) {
      const resetTime = contactRateLimiter.getResetTime(clientIP);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60); // minutes

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${remainingTime} minutes.`,
          code: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (resetTime - Date.now()) / 1000
            ).toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          code: "VALIDATION_ERROR",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Check honeypot field
    if (formData.website && formData.website.length > 0) {
      // This is likely spam, but don't reveal that to the client
      console.warn(
        `Honeypot triggered for IP ${clientIP}: ${formData.website}`
      );

      // Return success to avoid revealing the honeypot
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      });
    }

    // Initialize email service
    const emailService = EmailService.getInstance();

    try {
      // Send the main contact email
      await emailService.sendContactEmail(formData);

      // Send confirmation email if requested
      if (formData.sendCopy) {
        try {
          await emailService.sendConfirmationEmail(formData);
        } catch (confirmationError) {
          // Log the error but don't fail the main request
          console.error(
            "Failed to send confirmation email:",
            confirmationError
          );
        }
      }

      // Log successful submission (without sensitive data)
      console.log(
        `Contact form submitted successfully from IP ${clientIP} by ${formData.name}`
      );

      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      return NextResponse.json(
        {
          error: "Failed to send message. Please try again later.",
          code: "EMAIL_SEND_ERROR",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
