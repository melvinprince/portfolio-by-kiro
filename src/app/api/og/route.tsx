import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Modern Portfolio";
    const subtitle = searchParams.get("subtitle") || "Full Stack Developer";
    const description = searchParams.get("description");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #1e293b 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #1e40af 0%, transparent 50%)
            `,
            fontFamily: "system-ui, sans-serif",
            position: "relative",
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
              backgroundSize: "50px 50px",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px",
              zIndex: 1,
            }}
          >
            {/* Main Title */}
            <h1
              style={{
                fontSize: "72px",
                fontWeight: 600,
                color: "#ffffff",
                margin: "0 0 24px 0",
                lineHeight: 1.1,
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "32px",
                fontWeight: 400,
                color: "#94a3b8",
                margin: "0 0 32px 0",
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </p>

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 400,
                  color: "#64748b",
                  margin: "0",
                  lineHeight: 1.3,
                  maxWidth: "800px",
                }}
              >
                {description}
              </p>
            )}

            {/* Accent Line */}
            <div
              style={{
                width: "120px",
                height: "4px",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                borderRadius: "2px",
                marginTop: "40px",
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
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
