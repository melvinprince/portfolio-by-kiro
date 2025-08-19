"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BlogCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
            </div>

            {/* Date and read time skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-4 bg-muted rounded animate-pulse w-24" />
              <div className="w-1 h-1 bg-muted rounded-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
            </div>
          </div>

          {/* External link icon skeleton */}
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Preview text skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </div>

        {/* Border and read more link skeleton */}
        <div className="pt-4 border-t border-border">
          <div className="h-4 bg-muted rounded animate-pulse w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
