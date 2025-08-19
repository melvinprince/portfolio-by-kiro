"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/motion";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="min-h-[60vh] flex items-center justify-center">
        <StaggerContainer className="text-center max-w-md mx-auto">
          <StaggerItem>
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-destructive/20 mb-4">
                500
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-8">
                An unexpected error occurred. Please try again or contact
                support if the problem persists.
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
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
