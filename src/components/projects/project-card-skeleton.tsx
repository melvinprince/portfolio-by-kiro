export function ProjectCardSkeleton() {
  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-video bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-muted rounded-md w-3/4 animate-pulse" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
        </div>

        {/* Tech badges skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-5 bg-muted rounded-full w-12 animate-pulse"
            />
          ))}
        </div>

        {/* Links skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded-md w-20 animate-pulse" />
          <div className="h-8 bg-muted rounded-md w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
