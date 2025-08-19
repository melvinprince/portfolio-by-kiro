import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Static project data for OG image generation (edge-compatible)
const projectsData = {
  "ecommerce-platform": {
    title: "E-Commerce Platform",
    summary:
      "Full-stack e-commerce solution with modern payment integration and admin dashboard",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
    ],
    year: 2024,
    featured: true,
  },
  "task-management-app": {
    title: "Task Management App",
    summary:
      "Collaborative task management application with real-time updates and team features",
    tech: [
      "React",
      "Node.js",
      "Socket.io",
      "MongoDB",
      "Express",
      "Material-UI",
    ],
    year: 2024,
    featured: true,
  },
  "weather-dashboard": {
    title: "Weather Dashboard",
    summary:
      "Interactive weather dashboard with data visualization and location-based forecasts",
    tech: ["Vue.js", "D3.js", "OpenWeather API", "Chart.js", "PWA"],
    year: 2023,
    featured: true,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const projectData = projectsData[slug as keyof typeof projectsData];

    if (!projectData) {
      return new Response("Project not found", { status: 404 });
    }

    // For now, we'll use system fonts (in production, load custom fonts)
    const fontSemiBold = null;
    const fontRegular = null;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "80px",
            fontFamily: "Inter",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              padding: "60px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            {/* Project Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                padding: "8px 16px",
                marginBottom: "24px",
                fontSize: "16px",
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              📁 Project
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.1,
                marginBottom: "24px",
                maxWidth: "100%",
              }}
            >
              {projectData.title}
            </h1>

            {/* Summary */}
            <p
              style={{
                fontSize: "24px",
                color: "#6b7280",
                lineHeight: 1.4,
                marginBottom: "32px",
                maxWidth: "100%",
              }}
            >
              {projectData.summary}
            </p>

            {/* Tech Stack */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {projectData.tech.slice(0, 6).map((tech, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ddd6fe",
                    color: "#5b21b6",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </div>
              ))}
              {projectData.tech.length > 6 && (
                <div
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  +{projectData.tech.length - 6} more
                </div>
              )}
            </div>

            {/* Year and Featured */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "18px",
                color: "#6b7280",
              }}
            >
              <span>{projectData.year}</span>
              {projectData.featured && (
                <>
                  <span>•</span>
                  <span style={{ color: "#f59e0b" }}>⭐ Featured</span>
                </>
              )}
            </div>
          </div>

          {/* Portfolio Branding */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "80px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "18px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              💼
            </div>
            <span>Portfolio</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          ...(fontSemiBold
            ? [
                {
                  name: "Inter",
                  data: fontSemiBold,
                  style: "normal" as const,
                  weight: 600 as const,
                },
              ]
            : []),
          ...(fontRegular
            ? [
                {
                  name: "Inter",
                  data: fontRegular,
                  style: "normal" as const,
                  weight: 400 as const,
                },
              ]
            : []),
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
