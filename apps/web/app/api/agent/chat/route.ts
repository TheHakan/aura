import { generateText } from "ai";
import { getModel } from "@/lib/ai/clients";
import { NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages?: Message[];
  anthropicKey?: string;
  openaiKey?: string;
}

const SYSTEM_PROMPT = `You are AURA, an AI command center for content creators and developers.

You can help with:
- YouTube channel management and analytics strategy
- Social media content planning and scheduling
- DevOps monitoring insights
- AI content generation (scripts, titles, thumbnails)
- Automation workflow design
- Server and infrastructure guidance

You have access to the AURA platform which includes:
CHANNELS (YouTube), BROADCAST (social scheduling), FLOW (n8n automation),
OPS (server monitoring), STUDIO (AI content), TERMINAL (SSH), VAULT (secrets), GRID (analytics).

Be concise, technical, and helpful. Use terminal-style formatting when appropriate.`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const { model, backend } = getModel(body.anthropicKey, body.openaiKey);
    const { text } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      maxTokens: 2048,
    });

    return NextResponse.json({ text, backend });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
