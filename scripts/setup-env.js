#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log("🚀 Portfolio Environment Setup\n");

  const envPath = path.join(process.cwd(), ".env.local");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      "⚠️  .env.local already exists. Overwrite? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("Please provide the following configuration values:\n");

  // Site configuration
  const siteUrl = await question("🌐 Site URL (e.g., https://yourname.dev): ");
  const siteName = await question("📝 Site Name (e.g., John Doe Portfolio): ");
  const siteDescription = await question("📄 Site Description: ");

  // Email configuration
  const setupEmail = await question("📧 Setup email functionality? (y/N): ");
  let emailConfig = "";

  if (setupEmail.toLowerCase() === "y") {
    const resendApiKey = await question("🔑 Resend API Key: ");
    const fromEmail = await question(
      "📤 From Email (e.g., noreply@yourname.dev): "
    );
    const contactEmail = await question(
      "📥 Contact Email (where messages are sent): "
    );

    emailConfig = `
# Email configuration
RESEND_API_KEY=${resendApiKey}
FROM_EMAIL=${fromEmail}
TO_EMAIL=${contactEmail}
CONTACT_EMAIL=${contactEmail}`;
  } else {
    emailConfig = `
# Email configuration (disabled)
# RESEND_API_KEY=your_resend_api_key
# FROM_EMAIL=noreply@yourdomain.com
# TO_EMAIL=your_email@example.com
# CONTACT_EMAIL=your_email@example.com`;
  }

  // Medium RSS
  const setupMedium = await question(
    "📰 Setup Medium RSS integration? (y/N): "
  );
  let mediumConfig = "";

  if (setupMedium.toLowerCase() === "y") {
    const mediumUsername = await question(
      "👤 Medium Username (e.g., @yourname): "
    );
    mediumConfig = `
# Medium RSS integration
MEDIUM_USERNAME=${mediumUsername}
NEXT_PUBLIC_MEDIUM_USERNAME=${mediumUsername}`;
  } else {
    mediumConfig = `
# Medium RSS integration (disabled)
# MEDIUM_USERNAME=your_medium_username
# NEXT_PUBLIC_MEDIUM_USERNAME=your_medium_username`;
  }

  // Analytics
  const setupAnalytics = await question("📊 Setup analytics? (y/N): ");
  let analyticsConfig = "";

  if (setupAnalytics.toLowerCase() === "y") {
    const analyticsType = await question(
      "📈 Analytics type (vercel/plausible): "
    );

    if (analyticsType.toLowerCase() === "plausible") {
      const plausibleDomain = await question(
        "🌐 Plausible domain (e.g., yourname.dev): "
      );
      analyticsConfig = `
# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=${plausibleDomain}
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true`;
    } else {
      analyticsConfig = `
# Analytics (Vercel)
VERCEL_ANALYTICS_ID=auto
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true`;
    }
  } else {
    analyticsConfig = `
# Analytics (disabled)
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
# VERCEL_ANALYTICS_ID=your_vercel_analytics_id
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false`;
  }

  // Generate .env.local content
  const envContent = `# Portfolio Environment Configuration
# Generated on ${new Date().toISOString()}

# Site configuration
NEXT_PUBLIC_SITE_URL=${siteUrl}
NEXT_PUBLIC_SITE_NAME="${siteName}"
NEXT_PUBLIC_SITE_DESCRIPTION="${siteDescription}"
${emailConfig}
${mediumConfig}
${analyticsConfig}

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=3600000

# Environment
NODE_ENV=development
`;

  // Write .env.local file
  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Environment configuration created successfully!");
  console.log("📁 File saved to: .env.local");
  console.log("\n📋 Next steps:");
  console.log("1. Review and adjust the generated .env.local file");
  console.log(
    "2. For production, set these variables in your deployment platform"
  );
  console.log("3. Run `npm run validate:env` to verify configuration");
  console.log("4. Run `npm run dev` to start development");

  rl.close();
}

setupEnvironment().catch(console.error);
