import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="min-h-[60vh] flex items-center justify-center">
        <StaggerContainer className="text-center max-w-md mx-auto">
          <StaggerItem>
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-muted-foreground/20 mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Page Not Found
              </h2>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Go Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                Looking for something specific?{" "}
                <Link
                  href="/contact"
                  className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Get in touch
                </Link>
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
