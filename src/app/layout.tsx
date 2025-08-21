import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/theme-context";
import { PerformanceProvider } from "@/components/providers/performance-provider";
import { PerformanceMonitor } from "@/components/performance/performance-monitor";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { PerformanceMonitor as AnalyticsPerformanceMonitor } from "@/components/analytics/performance-monitor";
import { ClientHeader } from "@/components/layout/client-header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chat";
import { SkipLinks } from "@/components/layout/skip-links";
import { StructuredData } from "@/components/seo/structured-data";
import {
  generatePersonSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateStructuredData,
} from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { seoConfig } from "@/lib/seo-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: seoConfig.siteName,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.siteDescription,
  keywords: [...seoConfig.defaultKeywords],
  authors: [{ name: seoConfig.author.name }],
  creator: seoConfig.author.name,
  publisher: seoConfig.siteName,
  metadataBase: new URL(seoConfig.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: seoConfig.siteName,
    description: seoConfig.siteDescription,
    siteName: seoConfig.siteName,
    images: [
      {
        url: seoConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: seoConfig.social.twitter,
    creator: seoConfig.social.twitter,
    title: seoConfig.siteName,
    description: seoConfig.siteDescription,
    images: [seoConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData([
    generatePersonSchema(),
    generateWebSiteSchema(),
    generateOrganizationSchema(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//medium.com" />

        {/* Performance hints */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLinks />
        <AnalyticsProvider>
          <PerformanceProvider>
            <ThemeProvider>
              <div className="min-h-screen flex flex-col">
                <ClientHeader />
                <main id="main-content" className="flex-1" role="main">
                  {children}
                </main>
                <Footer />
                <Chatbot />
                <PerformanceMonitor />
                <AnalyticsPerformanceMonitor />
              </div>
            </ThemeProvider>
          </PerformanceProvider>
        </AnalyticsProvider>
        <StructuredData data={structuredData} />
        <Analytics />
      </body>
    </html>
  );
}
