import { generateText } from "ai";
import { getAnthropicClient, DEFAULT_MODEL } from "@/lib/ai/clients";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { prompt?: string };
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const anthropic = getAnthropicClient();
    const { text } = await generateText({
      model: anthropic(DEFAULT_MODEL),
      system:
        "You are AURA Studio, an AI assistant specialized in creating YouTube and social media content. Be concise, creative, and optimize for engagement. Format output clearly.",
      prompt,
      maxTokens: 1024,
    });

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
