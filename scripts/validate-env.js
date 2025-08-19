#!/usr/bin/env node

// Simple environment validation script that doesn't require TypeScript compilation
const fs = require("fs");
const path = require("path");

function validateEnvironment() {
  console.log("🔍 Validating environment configuration...\n");

  const errors = [];
  const warnings = [];

  // Check if .env.local exists
  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envLocalPath)) {
    errors.push(
      ".env.local file not found. Run `npm run setup:env` to create it."
    );
    return { errors, warnings };
  }

  // Load environment variables
  require("dotenv").config({ path: envLocalPath });

  const env = process.env;

  // Required variables
  const required = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_SITE_DESCRIPTION",
  ];

  required.forEach((key) => {
    if (!env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Validate site URL
  if (env.NEXT_PUBLIC_SITE_URL) {
    try {
      const url = new URL(env.NEXT_PUBLIC_SITE_URL);
      if (env.NODE_ENV === "production" && url.protocol !== "https:") {
        errors.push("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
      }
    } catch (e) {
      errors.push("NEXT_PUBLIC_SITE_URL is not a valid URL");
    }
  }

  // Check email configuration
  const hasResendKey = !!env.RESEND_API_KEY;
  const hasContactEmail = !!env.CONTACT_EMAIL;

  if (hasResendKey && !hasContactEmail) {
    errors.push("CONTACT_EMAIL is required when RESEND_API_KEY is provided");
  }

  if (hasContactEmail && !hasResendKey) {
    warnings.push(
      "CONTACT_EMAIL is set but RESEND_API_KEY is missing - contact form will not work"
    );
  }

  // Check Medium configuration
  const hasMediumUsername = !!env.MEDIUM_USERNAME;
  const hasPublicMediumUsername = !!env.NEXT_PUBLIC_MEDIUM_USERNAME;

  if (hasMediumUsername && !hasPublicMediumUsername) {
    errors.push(
      "NEXT_PUBLIC_MEDIUM_USERNAME must be set if MEDIUM_USERNAME is provided"
    );
  }

  // Check analytics configuration
  const analyticsEnabled = env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
  const hasPlausible = !!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const hasVercelAnalytics = !!env.VERCEL_ANALYTICS_ID;
  const hasGenericAnalytics = !!env.NEXT_PUBLIC_ANALYTICS_ID;

  if (
    analyticsEnabled &&
    !hasPlausible &&
    !hasVercelAnalytics &&
    !hasGenericAnalytics
  ) {
    warnings.push(
      "Analytics is enabled but no analytics provider is configured"
    );
  }

  return { errors, warnings };
}

// Run validation
try {
  const { errors, warnings } = validateEnvironment();

  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach((warning) => console.log(`  - ${warning}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.log("❌ Errors:");
    errors.forEach((error) => console.log(`  - ${error}`));
    console.log("\nPlease fix these errors before proceeding.");
    process.exit(1);
  }

  console.log("✅ Environment validation passed!");
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  process.exit(1);
}
