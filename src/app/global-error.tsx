"use client";

import { useEffect } from "react";
// import Link from "next/link"; // Not used in global error page

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8">
                <h1 className="text-8xl font-bold text-destructive/20 mb-4">
                  500
                </h1>
                <h2 className="text-2xl font-semibold mb-4">Critical Error</h2>
                <p className="text-muted-foreground mb-8">
                  A critical error occurred that prevented the application from
                  loading properly.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <details className="text-left bg-muted p-4 rounded-md mb-4">
                    <summary className="cursor-pointer text-sm font-medium mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-xs text-muted-foreground overflow-auto">
                      {error.message}
                      {error.digest && `\nDigest: ${error.digest}`}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Go Home
                </button>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                <p>
                  Need help?{" "}
                  <button
                    onClick={() => (window.location.href = "/contact")}
                    className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm bg-transparent border-none cursor-pointer"
                  >
                    Contact support
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
