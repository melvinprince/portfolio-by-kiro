import { z } from "zod";

// Server-side environment schema
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Email configuration
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  TO_EMAIL: z.string().email().optional(),
  CONTACT_EMAIL: z.string().email().optional(),

  // Medium RSS
  MEDIUM_USERNAME: z.string().optional(),

  // Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),

  // Rate limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(3600000), // 1 hour
});

// Client-side environment schema
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Portfolio"),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default("Modern portfolio website"),
  NEXT_PUBLIC_MEDIUM_USERNAME: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: z.coerce.boolean().default(false),
});

// Validate server environment
function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid server environment variables:", error);
    throw new Error("Invalid server environment configuration");
  }
}

// Validate client environment
function validateClientEnv() {
  try {
    const clientEnv = Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_")
      )
    );

    // Provide defaults for development if missing
    if (
      !clientEnv.NEXT_PUBLIC_SITE_URL &&
      process.env.NODE_ENV === "development"
    ) {
      clientEnv.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    }

    return clientEnvSchema.parse(clientEnv);
  } catch (error) {
    console.error("❌ Invalid client environment variables:", error);
    console.error(
      "Available client env vars:",
      Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_"))
    );
    throw new Error("Invalid client environment configuration");
  }
}

// Export validated environment variables
export const serverEnv = validateServerEnv();

// Only validate client env on server side
export const clientEnv =
  typeof window === "undefined"
    ? validateClientEnv()
    : {
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio",
        NEXT_PUBLIC_SITE_DESCRIPTION:
          process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
          "Modern portfolio website",
        NEXT_PUBLIC_MEDIUM_USERNAME: process.env.NEXT_PUBLIC_MEDIUM_USERNAME,
        NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        NEXT_PUBLIC_ENABLE_ANALYTICS:
          process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
        NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING:
          process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "false",
      };

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Environment helpers
export const isDevelopment = serverEnv.NODE_ENV === "development";
export const isProduction = serverEnv.NODE_ENV === "production";
export const isTest = serverEnv.NODE_ENV === "test";

// Feature flags based on environment
export const features = {
  analytics: clientEnv.NEXT_PUBLIC_ENABLE_ANALYTICS && isProduction,
  performanceMonitoring: clientEnv.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING,
  email: !!serverEnv.RESEND_API_KEY && !!serverEnv.CONTACT_EMAIL,
  mediumRss: !!serverEnv.MEDIUM_USERNAME,
} as const;

// Validation function for runtime checks
export function validateEnvironment() {
  const errors: string[] = [];

  // Check required production variables
  if (isProduction) {
    if (!serverEnv.RESEND_API_KEY) {
      errors.push("RESEND_API_KEY is required in production");
    }
    if (!serverEnv.CONTACT_EMAIL) {
      errors.push("CONTACT_EMAIL is required in production");
    }
    if (!clientEnv.NEXT_PUBLIC_SITE_URL.startsWith("https://")) {
      errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
    }
  }

  // Check Medium configuration
  if (serverEnv.MEDIUM_USERNAME && !clientEnv.NEXT_PUBLIC_MEDIUM_USERNAME) {
    errors.push(
      "NEXT_PUBLIC_MEDIUM_USERNAME must be set if MEDIUM_USERNAME is provided"
    );
  }

  // Check analytics configuration
  if (clientEnv.NEXT_PUBLIC_ENABLE_ANALYTICS) {
    if (
      !clientEnv.NEXT_PUBLIC_ANALYTICS_ID &&
      !clientEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN &&
      !serverEnv.VERCEL_ANALYTICS_ID
    ) {
      errors.push(
        "At least one analytics provider must be configured when analytics is enabled"
      );
    }
  }

  if (errors.length > 0) {
    console.error("❌ Environment validation failed:");
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error("Environment validation failed");
  }

  console.log("✅ Environment validation passed");
  return true;
}
