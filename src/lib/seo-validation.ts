import { Metadata } from "next";

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function validateMetadata(metadata: Metadata): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Title validation
  if (!metadata.title) {
    errors.push("Title is required");
  } else {
    const titleString =
      typeof metadata.title === "string"
        ? metadata.title
        : typeof metadata.title === "object" &&
          metadata.title &&
          "default" in metadata.title
        ? (metadata.title as { default: string }).default || ""
        : "";

    if (titleString.length < 10) {
      warnings.push("Title is too short (recommended: 10-60 characters)");
    }
    if (titleString.length > 60) {
      warnings.push("Title is too long (recommended: 10-60 characters)");
    }
  }

  // Description validation
  if (!metadata.description) {
    errors.push("Description is required");
  } else {
    if (metadata.description.length < 120) {
      warnings.push(
        "Description is too short (recommended: 120-160 characters)"
      );
    }
    if (metadata.description.length > 160) {
      warnings.push(
        "Description is too long (recommended: 120-160 characters)"
      );
    }
  }

  // Keywords validation
  if (metadata.keywords) {
    const keywordString = Array.isArray(metadata.keywords)
      ? metadata.keywords.join(", ")
      : metadata.keywords;
    const keywordCount = keywordString.split(",").length;

    if (keywordCount > 10) {
      warnings.push("Too many keywords (recommended: 5-10 keywords)");
    }
  }

  // OpenGraph validation
  if (metadata.openGraph) {
    if (!metadata.openGraph.title) {
      warnings.push("OpenGraph title is missing");
    }
    if (!metadata.openGraph.description) {
      warnings.push("OpenGraph description is missing");
    }
    if (
      !metadata.openGraph.images ||
      (Array.isArray(metadata.openGraph.images) &&
        metadata.openGraph.images.length === 0)
    ) {
      warnings.push("OpenGraph image is missing");
    }
    if (!metadata.openGraph.url) {
      warnings.push("OpenGraph URL is missing");
    }
  } else {
    warnings.push("OpenGraph metadata is missing");
  }

  // Twitter Card validation
  if (metadata.twitter) {
    if (!metadata.twitter.title) {
      warnings.push("Twitter title is missing");
    }
    if (!metadata.twitter.description) {
      warnings.push("Twitter description is missing");
    }
    if (
      !metadata.twitter.images ||
      (Array.isArray(metadata.twitter.images) &&
        metadata.twitter.images.length === 0)
    ) {
      warnings.push("Twitter image is missing");
    }
  } else {
    warnings.push("Twitter Card metadata is missing");
  }

  // Canonical URL validation
  if (!metadata.alternates?.canonical) {
    warnings.push("Canonical URL is missing");
  }

  // Robots validation
  if (!metadata.robots) {
    suggestions.push(
      "Consider adding robots metadata for better crawling control"
    );
  }

  // Authors validation
  if (
    !metadata.authors ||
    (Array.isArray(metadata.authors) && metadata.authors.length === 0)
  ) {
    suggestions.push("Consider adding author information");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

export function validateStructuredData(data: unknown): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!data) {
    errors.push("Structured data is missing");
    return { isValid: false, errors, warnings, suggestions };
  }

  try {
    const jsonString = JSON.stringify(data);
    const parsed = JSON.parse(jsonString);

    // Check for required @context
    if (!parsed["@context"]) {
      errors.push("@context is required in structured data");
    }

    // Check for @type or @graph
    if (!parsed["@type"] && !parsed["@graph"]) {
      errors.push("@type or @graph is required in structured data");
    }

    // Validate Person schema if present
    if (
      parsed["@type"] === "Person" ||
      (parsed["@graph"] &&
        parsed["@graph"].some(
          (item: unknown) =>
            (item as Record<string, unknown>)["@type"] === "Person"
        ))
    ) {
      const person =
        parsed["@type"] === "Person"
          ? parsed
          : parsed["@graph"].find(
              (item: unknown) =>
                (item as Record<string, unknown>)["@type"] === "Person"
            );

      if (!person.name) {
        warnings.push("Person schema is missing name property");
      }
      if (!person.url) {
        warnings.push("Person schema is missing url property");
      }
    }

    // Validate WebSite schema if present
    if (
      parsed["@type"] === "WebSite" ||
      (parsed["@graph"] &&
        parsed["@graph"].some(
          (item: unknown) =>
            (item as Record<string, unknown>)["@type"] === "WebSite"
        ))
    ) {
      const website =
        parsed["@type"] === "WebSite"
          ? parsed
          : parsed["@graph"].find(
              (item: unknown) =>
                (item as Record<string, unknown>)["@type"] === "WebSite"
            );

      if (!website.name) {
        warnings.push("WebSite schema is missing name property");
      }
      if (!website.url) {
        warnings.push("WebSite schema is missing url property");
      }
    }
  } catch {
    errors.push("Invalid JSON in structured data");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

export function generateSEOReport(
  metadata: Metadata,
  structuredData?: unknown
) {
  const metadataValidation = validateMetadata(metadata);
  const structuredDataValidation = structuredData
    ? validateStructuredData(structuredData)
    : {
        isValid: true,
        errors: [],
        warnings: ["No structured data provided"],
        suggestions: [],
      };

  const overallScore = calculateSEOScore(
    metadataValidation,
    structuredDataValidation
  );

  return {
    score: overallScore,
    metadata: metadataValidation,
    structuredData: structuredDataValidation,
    recommendations: generateRecommendations(
      metadataValidation,
      structuredDataValidation
    ),
  };
}

function calculateSEOScore(
  metadataValidation: SEOValidationResult,
  structuredDataValidation: SEOValidationResult
): number {
  let score = 100;

  // Deduct points for errors
  score -= metadataValidation.errors.length * 20;
  score -= structuredDataValidation.errors.length * 15;

  // Deduct points for warnings
  score -= metadataValidation.warnings.length * 5;
  score -= structuredDataValidation.warnings.length * 3;

  return Math.max(0, score);
}

function generateRecommendations(
  metadataValidation: SEOValidationResult,
  structuredDataValidation: SEOValidationResult
): string[] {
  const recommendations: string[] = [];

  if (metadataValidation.errors.length > 0) {
    recommendations.push("Fix critical metadata errors to improve SEO");
  }

  if (metadataValidation.warnings.length > 3) {
    recommendations.push(
      "Address metadata warnings to optimize search visibility"
    );
  }

  if (structuredDataValidation.errors.length > 0) {
    recommendations.push("Fix structured data errors for better rich snippets");
  }

  if (
    !metadataValidation.errors.length &&
    !metadataValidation.warnings.length
  ) {
    recommendations.push("Great job! Your metadata is well-optimized");
  }

  return recommendations;
}

export function logSEOReport(
  pageName: string,
  metadata: Metadata,
  structuredData?: unknown
) {
  if (process.env.NODE_ENV === "development") {
    const report = generateSEOReport(metadata, structuredData);
    console.group(`SEO Report for ${pageName}`);
    console.log(`Score: ${report.score}/100`);

    if (report.metadata.errors.length > 0) {
      console.error("Metadata Errors:", report.metadata.errors);
    }

    if (report.metadata.warnings.length > 0) {
      console.warn("Metadata Warnings:", report.metadata.warnings);
    }

    if (report.structuredData.errors.length > 0) {
      console.error("Structured Data Errors:", report.structuredData.errors);
    }

    if (report.recommendations.length > 0) {
      console.info("Recommendations:", report.recommendations);
    }

    console.groupEnd();
  }
}
