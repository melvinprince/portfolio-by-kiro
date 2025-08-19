import { NextRequest, NextResponse } from "next/server";

// Import chat context data
import chatContextData from "@/data/chat-context.json";

// Simple rate limiting for chat (more lenient than contact form)
const chatRateLimit = new Map<string, { count: number; resetTime: number }>();
const CHAT_RATE_LIMIT = 20; // 20 messages per hour
const CHAT_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return "unknown";
}

function checkChatRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = chatRateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    chatRateLimit.set(ip, { count: 1, resetTime: now + CHAT_RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= CHAT_RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Simple context-based response generation
function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Check for FAQ matches
  for (const faq of chatContextData.faq) {
    if (
      lowerMessage.includes(faq.q.toLowerCase().split(" ")[0]) ||
      faq.q
        .toLowerCase()
        .split(" ")
        .some((word: string) => word.length > 3 && lowerMessage.includes(word))
    ) {
      return faq.a;
    }
  }

  // Project-related queries
  if (
    lowerMessage.includes("project") ||
    lowerMessage.includes("work") ||
    lowerMessage.includes("portfolio")
  ) {
    const projectList = chatContextData.projectsIndex
      .map((p: any) => `• **${p.title}**: ${p.summary} (${p.tech.join(", ")})`)
      .join("\n");

    return `Here are some of my featured projects:\n\n${projectList}\n\nYou can view more details on the [projects page](/projects).`;
  }

  // Skills-related queries
  if (
    lowerMessage.includes("skill") ||
    lowerMessage.includes("technology") ||
    lowerMessage.includes("tech")
  ) {
    const skillList = chatContextData.skills.slice(0, 6).join(", ");
    return `My key skills include: ${skillList}. You can see my complete tech stack on the [tech page](/tech).`;
  }

  // Contact-related queries
  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("hire") ||
    lowerMessage.includes("work together")
  ) {
    return `I'd love to hear from you! You can reach out through the [contact form](/contact) or connect with me on [LinkedIn](${chatContextData.contact.linkedin}). ${chatContextData.contact.availability}`;
  }

  // Experience queries
  if (
    lowerMessage.includes("experience") ||
    lowerMessage.includes("background")
  ) {
    return chatContextData.bio;
  }

  // Greeting responses
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hi there! I'm Melvin's portfolio assistant. I can help you learn about his experience, projects, and skills. What would you like to know?";
  }

  // Default response
  return "I'd be happy to help! You can ask me about Melvin's experience, projects, skills, or how to get in touch. Try asking something like 'What projects have you worked on?' or 'What's your experience with React?'";
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!checkChatRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait before sending another." },
        { status: 429 }
      );
    }

    const { message } = await request.json();

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Generate response
    const response = generateResponse(message.trim());

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending chunks
        const words = response.split(" ");
        let index = 0;

        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words[index] + (index < words.length - 1 ? " " : "");
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            );
            index++;
            setTimeout(sendChunk, 50); // 50ms delay between words
          } else {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
