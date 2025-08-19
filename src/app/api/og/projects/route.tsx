import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Project";
    const tech = searchParams.get("tech")?.split(",") || [];
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();

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
            backgroundColor: "#0a0a0a",
            backgroundImage: `
              radial-gradient(circle at 20% 80%, #1e293b 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #059669 0%, transparent 50%)
            `,
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            padding: "80px",
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
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 1,
              maxWidth: "1000px",
            }}
          >
            {/* Project Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  fontSize: "24px",
                  color: "#64748b",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Project
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#64748b",
                  fontWeight: 400,
                }}
              >
                {year}
              </span>
            </div>

            {/* Project Title */}
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 600,
                color: "#ffffff",
                margin: "0 0 32px 0",
                lineHeight: 1.1,
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {/* Tech Stack */}
            {tech.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "40px",
                }}
              >
                {tech.slice(0, 6).map((techItem, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "18px",
                      color: "#93c5fd",
                      fontWeight: 400,
                    }}
                  >
                    {techItem.trim()}
                  </div>
                ))}
                {tech.length > 6 && (
                  <div
                    style={{
                      backgroundColor: "rgba(100, 116, 139, 0.1)",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "18px",
                      color: "#64748b",
                      fontWeight: 400,
                    }}
                  >
                    +{tech.length - 6} more
                  </div>
                )}
              </div>
            )}

            {/* Accent Line */}
            <div
              style={{
                width: "120px",
                height: "4px",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #059669)",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Bottom Brand */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#3b82f6",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                color: "#64748b",
                fontWeight: 400,
              }}
            >
              portfolio.example.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating project OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
