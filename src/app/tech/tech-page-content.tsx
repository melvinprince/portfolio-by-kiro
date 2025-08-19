"use client";

import { techStack, techDomains, TechItem } from "@/data/tech-stack";
import { TechGrid } from "@/components/tech";

const levelIcons = {
  learning: "🌱",
  intermediate: "⚡",
  advanced: "🚀",
  expert: "⭐",
};

const levelColors = {
  learning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  advanced: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  expert:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function TechPageContent() {
  const handleTechClick = (tech: TechItem) => {
    if (tech.site) {
      window.open(tech.site, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Tech Stack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Technologies I work with, organized by domain and proficiency level.
          I'm always learning and exploring new tools to solve problems
          effectively.
        </p>
      </header>

      {/* Legend */}
      <section
        className="mb-12 p-6 bg-muted/50 rounded-lg"
        aria-labelledby="legend-heading"
      >
        <h2
          id="legend-heading"
          className="text-lg font-semibold text-foreground mb-4"
        >
          Proficiency Levels
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
          {Object.entries(levelIcons).map(([level, icon]) => (
            <div
              key={level}
              className="flex items-center gap-2"
              role="listitem"
            >
              <span className="text-lg" aria-hidden="true">
                {icon}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  levelColors[level as keyof typeof levelColors]
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
              <div className="flex gap-0.5 ml-2" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index <
                      { learning: 1, intermediate: 2, advanced: 3, expert: 4 }[
                        level as keyof typeof levelIcons
                      ]
                        ? "bg-current opacity-100"
                        : "bg-current opacity-20"
                    }`}
                  />
                ))}
              </div>
              <span className="sr-only">
                {level} level -{" "}
                {
                  { learning: 1, intermediate: 2, advanced: 3, expert: 4 }[
                    level as keyof typeof levelIcons
                  ]
                }{" "}
                out of 4 proficiency dots
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Hover over technologies for detailed information. Use keyboard
          navigation with Tab and Enter keys.
        </p>
      </section>

      {/* Tech Grid */}
      <section aria-labelledby="tech-grid-heading">
        <h2 id="tech-grid-heading" className="sr-only">
          Technologies by Domain
        </h2>
        <TechGrid
          techStack={techStack}
          onTechClick={handleTechClick}
          showDomainHeaders={true}
          gridLayout="comfortable"
          className="mb-16"
        />
      </section>

      {/* Stats Section */}
      <section className="mt-16" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Technology Statistics
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-muted/50 rounded-lg">
            <div
              className="text-2xl font-bold text-accent mb-2"
              aria-label={`${
                techStack.filter((t) => t.level === "expert").length
              } technologies at expert level`}
            >
              {techStack.filter((t) => t.level === "expert").length}
            </div>
            <div className="text-sm text-muted-foreground">Expert Level</div>
          </div>
          <div className="p-6 bg-muted/50 rounded-lg">
            <div
              className="text-2xl font-bold text-accent mb-2"
              aria-label={`${techStack.length} total technologies`}
            >
              {techStack.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Technologies
            </div>
          </div>
          <div className="p-6 bg-muted/50 rounded-lg">
            <div
              className="text-2xl font-bold text-accent mb-2"
              aria-label={`${techDomains.length} domains covered`}
            >
              {techDomains.length}
            </div>
            <div className="text-sm text-muted-foreground">Domains Covered</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="text-center mt-16 p-8 bg-muted/50 rounded-lg"
        aria-labelledby="cta-heading"
      >
        <h2
          id="cta-heading"
          className="text-xl font-semibold text-foreground mb-2"
        >
          Have a project in mind?
        </h2>
        <p className="text-muted-foreground mb-4">
          I'm always interested in discussing new opportunities and technical
          challenges.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-accent-foreground bg-accent rounded-md hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
          aria-label="Contact me to discuss your project"
        >
          Let's Talk
        </a>
      </section>
    </div>
  );
}
