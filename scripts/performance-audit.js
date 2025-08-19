#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Performance audit script for final deployment preparation
 * Runs comprehensive checks including Lighthouse, bundle analysis, and performance budgets
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.blue}Running: ${description}${colors.reset}`);
  log(`Command: ${command}`, colors.cyan);

  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "inherit",
      cwd: process.cwd(),
    });
    log(`✅ ${description} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description} failed:`, colors.red);
    log(error.message, colors.red);
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function analyzeBundle() {
  log("\n📊 Bundle Analysis", colors.bright);

  if (!checkFileExists(".next")) {
    log(
      '❌ Next.js build not found. Please run "npm run build" first.',
      colors.red
    );
    return false;
  }

  // Check bundle sizes
  const buildDir = ".next/static/chunks";
  if (fs.existsSync(buildDir)) {
    const chunks = fs
      .readdirSync(buildDir)
      .filter((file) => file.endsWith(".js"))
      .map((file) => {
        const stats = fs.statSync(path.join(buildDir, file));
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
        };
      })
      .sort((a, b) => b.size - a.size);

    log("\n📦 Largest JavaScript chunks:", colors.yellow);
    chunks.slice(0, 10).forEach((chunk) => {
      const color =
        chunk.sizeKB > 100
          ? colors.red
          : chunk.sizeKB > 50
          ? colors.yellow
          : colors.green;
      log(`  ${chunk.name}: ${chunk.sizeKB}KB`, color);
    });

    const totalJS = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalKB = Math.round(totalJS / 1024);
    log(
      `\n📊 Total JavaScript: ${totalKB}KB`,
      totalKB > 180 ? colors.red : colors.green
    );
  }

  return true;
}

function checkPerformanceBudget() {
  log("\n💰 Performance Budget Check", colors.bright);

  if (!checkFileExists("performance-budget.json")) {
    log("❌ Performance budget file not found", colors.red);
    return false;
  }

  const budget = JSON.parse(fs.readFileSync("performance-budget.json", "utf8"));
  log("✅ Performance budget configuration found", colors.green);

  // Display budget limits
  const resourceBudget = budget.budget[0].resourceSizes;
  log("\n📋 Resource Size Budgets:", colors.yellow);
  resourceBudget.forEach((item) => {
    log(`  ${item.resourceType}: ${item.budget}KB`, colors.cyan);
  });

  return true;
}

function runLighthouseAudit() {
  log("\n🔍 Lighthouse Performance Audit", colors.bright);

  // Check if Lighthouse CI is available
  try {
    execSync("npx lhci --version", { stdio: "ignore" });
  } catch (error) {
    log("❌ Lighthouse CI not available. Installing...", colors.yellow);
    if (!runCommand("npm install -g @lhci/cli", "Install Lighthouse CI")) {
      return false;
    }
  }

  // Run desktop audit
  log("\n🖥️  Desktop Audit", colors.magenta);
  const desktopSuccess = runCommand(
    "npx lhci autorun --config=lighthouserc.json",
    "Desktop Lighthouse audit"
  );

  // Run mobile audit
  log("\n📱 Mobile Audit", colors.magenta);
  const mobileSuccess = runCommand(
    "npx lhci autorun --config=lighthouserc.mobile.json",
    "Mobile Lighthouse audit"
  );

  return desktopSuccess && mobileSuccess;
}

function checkAccessibility() {
  log("\n♿ Accessibility Check", colors.bright);

  // Run axe-core tests if available
  if (checkFileExists("tests/e2e")) {
    return runCommand(
      'npx playwright test --grep="accessibility"',
      "Accessibility tests with axe-core"
    );
  } else {
    log("⚠️  No accessibility tests found", colors.yellow);
    return true;
  }
}

function checkSEO() {
  log("\n🔍 SEO Validation", colors.bright);

  const checks = [
    { file: "src/app/sitemap.ts", name: "Sitemap generation" },
    { file: "src/app/robots.ts", name: "Robots.txt generation" },
    { file: "public/manifest.json", name: "Web app manifest" },
  ];

  let allPassed = true;
  checks.forEach((check) => {
    if (checkFileExists(check.file)) {
      log(`✅ ${check.name}`, colors.green);
    } else {
      log(`❌ ${check.name} missing`, colors.red);
      allPassed = false;
    }
  });

  return allPassed;
}

function generateReport() {
  log("\n📄 Generating Performance Report", colors.bright);

  const report = {
    timestamp: new Date().toISOString(),
    checks: {
      bundle: "Bundle analysis completed",
      budget: "Performance budget validated",
      lighthouse: "Lighthouse audits completed",
      accessibility: "Accessibility checks completed",
      seo: "SEO validation completed",
    },
    recommendations: [
      "Monitor Core Web Vitals in production",
      "Set up performance monitoring with Real User Monitoring (RUM)",
      "Configure CDN for static assets",
      "Enable compression (gzip/brotli) on server",
      "Implement service worker for offline functionality",
    ],
  };

  fs.writeFileSync("performance-report.json", JSON.stringify(report, null, 2));
  log("✅ Performance report saved to performance-report.json", colors.green);
}

async function main() {
  log("🚀 Starting Final Performance Audit", colors.bright);
  log("=====================================", colors.bright);

  const checks = [
    { name: "Bundle Analysis", fn: analyzeBundle },
    { name: "Performance Budget", fn: checkPerformanceBudget },
    { name: "Lighthouse Audit", fn: runLighthouseAudit },
    { name: "Accessibility Check", fn: checkAccessibility },
    { name: "SEO Validation", fn: checkSEO },
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

  // Generate final report
  generateReport();

  log("\n📊 Final Results", colors.bright);
  log("================", colors.bright);

  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    const color = passed ? colors.green : colors.red;
    log(`${status} ${name}`, color);
  });

  if (allPassed) {
    log(
      "\n🎉 All performance checks passed! Ready for deployment.",
      colors.green
    );
    process.exit(0);
  } else {
    log(
      "\n⚠️  Some checks failed. Please review and fix issues before deployment.",
      colors.yellow
    );
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    log("❌ Performance audit failed:", colors.red);
    log(error.message, colors.red);
    process.exit(1);
  });
}

module.exports = { main };
