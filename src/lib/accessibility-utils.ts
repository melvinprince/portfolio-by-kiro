/**
 * Accessibility utilities for consistent implementation across components
 */

/**
 * Generates accessible touch target styles ensuring minimum 44px size
 */
export const touchTargetStyles = "min-h-[44px] min-w-[44px]";

/**
 * Enhanced focus ring styles with better visibility
 */
export const focusRingStyles =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Screen reader only text that becomes visible on focus
 */
export const srOnlyFocusable =
  "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md";

/**
 * Generates ARIA attributes for expandable content
 */
export function getExpandableAttributes(
  isExpanded: boolean,
  controlsId?: string
) {
  return {
    "aria-expanded": isExpanded,
    ...(controlsId && { "aria-controls": controlsId }),
  };
}

/**
 * Generates ARIA attributes for form validation
 */
export function getValidationAttributes(error?: string, describedBy?: string) {
  return {
    "aria-invalid": !!error,
    ...(error && { "aria-describedby": describedBy }),
  };
}

/**
 * Generates ARIA attributes for loading states
 */
export function getLoadingAttributes(isLoading: boolean, label?: string) {
  return {
    "aria-busy": isLoading,
    ...(isLoading && label && { "aria-label": label }),
  };
}

/**
 * Keyboard event handler for activating elements with Enter or Space
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

/**
 * Generates unique IDs for form elements and their descriptions
 */
export function generateFormIds(baseId: string) {
  return {
    input: baseId,
    error: `${baseId}-error`,
    description: `${baseId}-description`,
    label: `${baseId}-label`,
  };
}

/**
 * Common ARIA live region attributes
 */
export const liveRegionAttributes = {
  polite: { "aria-live": "polite" as const },
  assertive: { "aria-live": "assertive" as const },
  off: { "aria-live": "off" as const },
};

/**
 * Landmark role attributes for semantic HTML
 */
export const landmarkRoles = {
  banner: { role: "banner" as const },
  navigation: { role: "navigation" as const },
  main: { role: "main" as const },
  complementary: { role: "complementary" as const },
  contentinfo: { role: "contentinfo" as const },
  search: { role: "search" as const },
  form: { role: "form" as const },
};

/**
 * Generates alt text for decorative vs informative images
 */
export function getImageAltText(
  title: string,
  isDecorative: boolean = false,
  context?: string
): string {
  if (isDecorative) return "";

  if (context) {
    return `${title} - ${context}`;
  }

  return title;
}

/**
 * Generates accessible button text for icon-only buttons
 */
export function getIconButtonLabel(
  action: string,
  context?: string,
  state?: string
): string {
  let label = action;

  if (context) {
    label += ` ${context}`;
  }

  if (state) {
    label += ` (${state})`;
  }

  return label;
}
