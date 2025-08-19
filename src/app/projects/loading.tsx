import { ProjectCardSkeleton } from "@/components/projects/project-card-skeleton";

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="h-8 bg-muted rounded-md w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-64 mx-auto animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 bg-muted rounded-md w-20 animate-pulse" />
        ))}
      </div>

      {/* Projects grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
