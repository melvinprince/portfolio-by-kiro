export default function ProjectLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero section skeleton */}
      <div className="mb-16">
        <div className="h-12 bg-muted rounded-md w-3/4 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-1/2 mx-auto mb-8 animate-pulse" />

        {/* Cover image skeleton */}
        <div className="aspect-video bg-muted rounded-lg mb-8 animate-pulse" />

        {/* Tech badges skeleton */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-muted rounded-full w-16 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="max-w-4xl mx-auto space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-muted rounded-md w-48 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
              <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
              <div className="h-4 bg-muted rounded-md w-4/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
