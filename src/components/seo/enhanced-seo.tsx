import Script from "next/script";
import { seoConfig } from "@/lib/seo-config";

interface EnhancedSEOProps {
  structuredData?: unknown;
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  preloadResources?: Array<{
    href: string;
    as: string;
    type?: string;
    crossOrigin?: string;
  }>;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export function EnhancedSEO({
  structuredData,
  additionalMeta = [],
  preloadResources = [],
  breadcrumbs,
  faq,
}: EnhancedSEOProps) {
  // Generate breadcrumb structured data
  const breadcrumbSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http")
            ? item.url
            : `${seoConfig.siteUrl}${item.url}`,
        })),
      }
    : null;

  // Generate FAQ structured data
  const faqSchema = faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  // Combine all structured data
  const combinedStructuredData = [
    structuredData,
    breadcrumbSchema,
    faqSchema,
  ].filter(Boolean);

  return (
    <>
      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name && { name: meta.name })}
          {...(meta.property && { property: meta.property })}
          content={meta.content}
        />
      ))}

      {/* Preload Resources */}
      {preloadResources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          {...(resource.type && { type: resource.type })}
          {...(resource.crossOrigin && {
            crossOrigin: resource.crossOrigin as
              | "anonymous"
              | "use-credentials",
          })}
        />
      ))}

      {/* Combined Structured Data */}
      {combinedStructuredData.length > 0 && (
        <Script
          id="enhanced-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              combinedStructuredData.length === 1
                ? combinedStructuredData[0]
                : {
                    "@context": "https://schema.org",
                    "@graph": combinedStructuredData,
                  },
              null,
              2
            ),
          }}
        />
      )}

      {/* Analytics Scripts */}
      {seoConfig.analytics.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seoConfig.analytics.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoConfig.analytics.googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Plausible Analytics */}
      {seoConfig.analytics.plausibleDomain && (
        <Script
          defer
          data-domain={seoConfig.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}

      {/* Vercel Analytics */}
      {seoConfig.analytics.vercelAnalytics && (
        <Script id="vercel-analytics" strategy="afterInteractive">
          {`
            window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
          `}
        </Script>
      )}

      {/* Performance monitoring */}
      <Script id="web-vitals" strategy="afterInteractive">
        {`
          if ('web-vitals' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
              getCLS(console.log);
              getFID(console.log);
              getFCP(console.log);
              getLCP(console.log);
              getTTFB(console.log);
            });
          }
        `}
      </Script>
    </>
  );
}
