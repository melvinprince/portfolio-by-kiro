/**
 * Accessibility testing utilities for development and testing
 */

/**
 * Checks if an element has proper focus management
 */
export function checkFocusManagement(element: HTMLElement): boolean {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  return Array.from(focusableElements).every((el) => {
    const htmlEl = el as HTMLElement;
    return (
      htmlEl.tabIndex >= 0 ||
      htmlEl.hasAttribute("aria-hidden") ||
      htmlEl.closest('[aria-hidden="true"]')
    );
  });
}

/**
 * Validates ARIA attributes on an element
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];

  // Check for required ARIA labels on interactive elements
  if (
    element.matches('button, [role="button"]') &&
    !element.getAttribute("aria-label") &&
    !element.textContent?.trim()
  ) {
    issues.push("Interactive element missing accessible name");
  }

  // Check for proper ARIA relationships
  const ariaDescribedBy = element.getAttribute("aria-describedby");
  if (ariaDescribedBy) {
    const describedElements = ariaDescribedBy
      .split(" ")
      .map((id) => document.getElementById(id));
    if (describedElements.some((el) => !el)) {
      issues.push("aria-describedby references non-existent element");
    }
  }

  const ariaLabelledBy = element.getAttribute("aria-labelledby");
  if (ariaLabelledBy) {
    const labelledElements = ariaLabelledBy
      .split(" ")
      .map((id) => document.getElementById(id));
    if (labelledElements.some((el) => !el)) {
      issues.push("aria-labelledby references non-existent element");
    }
  }

  return issues;
}

/**
 * Checks color contrast ratios (simplified check)
 */
export function checkColorContrast(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;

  // This is a simplified check - in production, you'd use a proper contrast calculation
  // For now, we just check that both colors are defined
  return backgroundColor !== "rgba(0, 0, 0, 0)" && color !== "rgba(0, 0, 0, 0)";
}

/**
 * Validates heading hierarchy
 */
export function validateHeadingHierarchy(
  container: HTMLElement = document.body
): string[] {
  const headings = Array.from(
    container.querySelectorAll("h1, h2, h3, h4, h5, h6")
  );
  const issues: string[] = [];

  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));

    if (index === 0 && level !== 1) {
      issues.push("First heading should be h1");
    }

    if (level > previousLevel + 1) {
      issues.push(`Heading level jumps from h${previousLevel} to h${level}`);
    }

    previousLevel = level;
  });

  return issues;
}

/**
 * Checks for proper alt text on images
 */
export function validateImageAltText(
  container: HTMLElement = document.body
): string[] {
  const images = Array.from(container.querySelectorAll("img"));
  const issues: string[] = [];

  images.forEach((img) => {
    const alt = img.getAttribute("alt");

    if (alt === null) {
      issues.push("Image missing alt attribute");
    } else if (alt === "" && !img.hasAttribute("aria-hidden")) {
      // Empty alt is okay for decorative images, but they should be marked as such
      const isDecorative =
        img.closest('[aria-hidden="true"]') ||
        img.getAttribute("role") === "presentation";
      if (!isDecorative) {
        issues.push("Image with empty alt text should be marked as decorative");
      }
    }
  });

  return issues;
}

/**
 * Validates form accessibility
 */
export function validateFormAccessibility(form: HTMLFormElement): string[] {
  const issues: string[] = [];

  // Check for form labels
  const inputs = Array.from(form.querySelectorAll("input, textarea, select"));
  inputs.forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    const id = htmlInput.id;
    const label = form.querySelector(`label[for="${id}"]`);
    const ariaLabel = htmlInput.getAttribute("aria-label");
    const ariaLabelledBy = htmlInput.getAttribute("aria-labelledby");

    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(
        `Input ${htmlInput.name || htmlInput.type} missing accessible label`
      );
    }
  });

  // Check for error message associations
  const errorElements = Array.from(
    form.querySelectorAll('[role="alert"], .error, [id*="error"]')
  );
  errorElements.forEach((error) => {
    const errorId = error.id;
    if (errorId) {
      const associatedInput = form.querySelector(
        `[aria-describedby*="${errorId}"]`
      );
      if (!associatedInput) {
        issues.push(`Error message ${errorId} not associated with any input`);
      }
    }
  });

  return issues;
}

/**
 * Comprehensive accessibility audit
 */
export function auditAccessibility(container: HTMLElement = document.body): {
  issues: string[];
  warnings: string[];
  passed: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  const passed: string[] = [];

  // Check heading hierarchy
  const headingIssues = validateHeadingHierarchy(container);
  issues.push(...headingIssues);
  if (headingIssues.length === 0) {
    passed.push("Heading hierarchy is correct");
  }

  // Check image alt text
  const imageIssues = validateImageAltText(container);
  issues.push(...imageIssues);
  if (imageIssues.length === 0) {
    passed.push("All images have proper alt text");
  }

  // Check forms
  const forms = Array.from(container.querySelectorAll("form"));
  forms.forEach((form) => {
    const formIssues = validateFormAccessibility(form);
    issues.push(...formIssues);
  });
  if (forms.length > 0 && issues.length === 0) {
    passed.push("All forms are properly labeled");
  }

  // Check focus management
  const interactiveElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );

  interactiveElements.forEach((element) => {
    const ariaIssues = validateAriaAttributes(element as HTMLElement);
    issues.push(...ariaIssues);
  });

  if (interactiveElements.length > 0 && issues.length === 0) {
    passed.push("All interactive elements have proper ARIA attributes");
  }

  return { issues, warnings, passed };
}

/**
 * Development helper to log accessibility issues
 */
export function logAccessibilityAudit(container?: HTMLElement): void {
  if (process.env.NODE_ENV !== "development") return;

  const audit = auditAccessibility(container);

  if (audit.issues.length > 0) {
    console.group("🚨 Accessibility Issues");
    audit.issues.forEach((issue) => console.error(issue));
    console.groupEnd();
  }

  if (audit.warnings.length > 0) {
    console.group("⚠️ Accessibility Warnings");
    audit.warnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  }

  if (audit.passed.length > 0) {
    console.group("✅ Accessibility Checks Passed");
    audit.passed.forEach((pass) => console.log(pass));
    console.groupEnd();
  }
}
