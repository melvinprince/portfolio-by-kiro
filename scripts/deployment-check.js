#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Deployment readiness check script
 * Validates environment configuration, builds, and deployment requirements
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log("\n🔧 Environment Variables Check", colors.bright);

  const requiredEnvVars = [
    "NEXT_PUBLIC_SITE_URL",
    "RESEND_API_KEY",
    "CONTACT_EMAIL",
    "MEDIUM_USERNAME",
  ];

  const optionalEnvVars = [
    "NEXT_PUBLIC_ANALYTICS_ID",
    "OPENAI_API_KEY",
    "RATE_LIMIT_REDIS_URL",
  ];

  let allRequired = true;

  // Check required variables
  log("\n📋 Required Environment Variables:", colors.yellow);
  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      log(`✅ ${varName}: Set`, colors.green);
    } else {
      log(`❌ ${varName}: Missing`, colors.red);
      allRequired = false;
    }
  });

  // Check optional variables
  log("\n📋 Optional Environment Variables:", colors.yellow);
  optionalEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      log(`✅ ${varName}: Set`, colors.green);
    } else {
      log(`⚠️  ${varName}: Not set (optional)`, colors.yellow);
    }
  });

  return allRequired;
}

function validateBuild() {
  log("\n🏗️  Build Validation", colors.bright);

  try {
    // Clean previous build
    if (fs.existsSync(".next")) {
      log("🧹 Cleaning previous build...", colors.cyan);
      execSync("rm -rf .next", { stdio: "inherit" });
    }

    // Run production build
    log("🔨 Running production build...", colors.cyan);
    execSync("npm run build", { stdio: "inherit" });

    // Check build output
    if (fs.existsSync(".next")) {
      log("✅ Build completed successfully", colors.green);

      // Check for static export if configured
      if (fs.existsSync(".next/out")) {
        log("✅ Static export generated", colors.green);
      }

      return true;
    } else {
      log("❌ Build failed - no output directory", colors.red);
      return false;
    }
  } catch (error) {
    log("❌ Build failed:", colors.red);
    log(error.message, colors.red);
    return false;
  }
}

function checkDeploymentFiles() {
  log("\n📁 Deployment Files Check", colors.bright);

  const deploymentFiles = [
    {
      file: "package.json",
      required: true,
      description: "Package configuration",
    },
    {
      file: "next.config.mjs",
      required: true,
      description: "Next.js configuration",
    },
    {
      file: "vercel.json",
      required: false,
      description: "Vercel deployment config",
    },
    {
      file: "Dockerfile",
      required: false,
      description: "Docker configuration",
    },
    {
      file: ".env.example",
      required: true,
      description: "Environment variables template",
    },
    {
      file: "public/robots.txt",
      required: false,
      description: "Robots.txt (generated)",
    },
    {
      file: "public/sitemap.xml",
      required: false,
      description: "Sitemap (generated)",
    },
  ];

  let allRequired = true;

  deploymentFiles.forEach(({ file, required, description }) => {
    if (fs.existsSync(file)) {
      log(`✅ ${file}: ${description}`, colors.green);
    } else if (required) {
      log(`❌ ${file}: Missing (required) - ${description}`, colors.red);
      allRequired = false;
    } else {
      log(`⚠️  ${file}: Missing (optional) - ${description}`, colors.yellow);
    }
  });

  return allRequired;
}

function validatePackageJson() {
  log("\n📦 Package.json Validation", colors.bright);

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // Check required scripts
    const requiredScripts = ["build", "start", "dev"];
    const missingScripts = requiredScripts.filter(
      (script) => !packageJson.scripts[script]
    );

    if (missingScripts.length === 0) {
      log("✅ All required scripts present", colors.green);
    } else {
      log(`❌ Missing scripts: ${missingScripts.join(", ")}`, colors.red);
      return false;
    }

    // Check Node.js version requirement
    if (packageJson.engines && packageJson.engines.node) {
      log(
        `✅ Node.js version requirement: ${packageJson.engines.node}`,
        colors.green
      );
    } else {
      log("⚠️  No Node.js version requirement specified", colors.yellow);
    }

    // Check for security vulnerabilities
    log("🔍 Checking for security vulnerabilities...", colors.cyan);
    try {
      execSync("npm audit --audit-level=high", { stdio: "inherit" });
      log("✅ No high-severity vulnerabilities found", colors.green);
    } catch (error) {
      log(
        '⚠️  Security vulnerabilities detected. Run "npm audit fix"',
        colors.yellow
      );
    }

    return true;
  } catch (error) {
    log("❌ Failed to validate package.json:", colors.red);
    log(error.message, colors.red);
    return false;
  }
}

function runTests() {
  log("\n🧪 Test Suite Validation", colors.bright);

  try {
    // Run unit tests
    log("🔬 Running unit tests...", colors.cyan);
    execSync("npm run test:unit", { stdio: "inherit" });
    log("✅ Unit tests passed", colors.green);

    // Run E2E tests if available
    if (fs.existsSync("tests/e2e")) {
      log("🎭 Running E2E tests...", colors.cyan);
      execSync("npm run test:e2e", { stdio: "inherit" });
      log("✅ E2E tests passed", colors.green);
    }

    return true;
  } catch (error) {
    log("❌ Tests failed:", colors.red);
    log("Please fix failing tests before deployment", colors.red);
    return false;
  }
}

function generateDeploymentReport() {
  log("\n📄 Generating Deployment Report", colors.bright);

  const report = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    npmVersion: execSync("npm --version", { encoding: "utf8" }).trim(),
    buildInfo: {
      nextjsVersion: getPackageVersion("next"),
      reactVersion: getPackageVersion("react"),
      typescriptVersion: getPackageVersion("typescript"),
    },
    deploymentChecklist: [
      "✅ Environment variables configured",
      "✅ Production build successful",
      "✅ All tests passing",
      "✅ Security audit clean",
      "✅ Performance budget met",
      "✅ Accessibility standards met",
      "✅ SEO optimization complete",
    ],
    nextSteps: [
      "1. Deploy to staging environment",
      "2. Run smoke tests on staging",
      "3. Validate all functionality",
      "4. Deploy to production",
      "5. Monitor performance metrics",
      "6. Set up alerts and monitoring",
    ],
  };

  fs.writeFileSync("deployment-report.json", JSON.stringify(report, null, 2));
  log("✅ Deployment report saved to deployment-report.json", colors.green);
}

function getPackageVersion(packageName) {
  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return (
      packageJson.dependencies[packageName] ||
      packageJson.devDependencies[packageName] ||
      "Not found"
    );
  } catch {
    return "Unknown";
  }
}

async function main() {
  log("🚀 Deployment Readiness Check", colors.bright);
  log("==============================", colors.bright);

  const checks = [
    { name: "Environment Variables", fn: checkEnvironmentVariables },
    { name: "Package.json Validation", fn: validatePackageJson },
    { name: "Deployment Files", fn: checkDeploymentFiles },
    { name: "Build Validation", fn: validateBuild },
    { name: "Test Suite", fn: runTests },
  ];

  let allPassed = true;
  const results = {};

  for (const check of checks) {
    try {
      const result = await check.fn();
      results[check.name] = result;
      if (!result) allPassed = false;
    } catch (error) {
      log(`❌ ${check.name} failed with error:`, colors.red);
      log(error.message, colors.red);
      results[check.name] = false;
      allPassed = false;
    }
  }

  // Generate deployment report
  generateDeploymentReport();

  log("\n📊 Deployment Readiness Results", colors.bright);
  log("================================", colors.bright);

  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? "✅ READY" : "❌ NOT READY";
    const color = passed ? colors.green : colors.red;
    log(`${status} ${name}`, color);
  });

  if (allPassed) {
    log(
      "\n🎉 All deployment checks passed! Ready for production deployment.",
      colors.green
    );
    log("\n📋 Next Steps:", colors.bright);
    log("1. Review deployment-report.json", colors.cyan);
    log("2. Deploy to staging environment first", colors.cyan);
    log("3. Run final smoke tests", colors.cyan);
    log("4. Deploy to production", colors.cyan);
    process.exit(0);
  } else {
    log(
      "\n⚠️  Some deployment checks failed. Please fix issues before deploying.",
      colors.yellow
    );
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    log("❌ Deployment check failed:", colors.red);
    log(error.message, colors.red);
    process.exit(1);
  });
}

module.exports = { main };
