import { generateText } from "ai";
import { getModel } from "@/lib/ai/clients";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      prompt?: string;
      anthropicKey?: string;
      openaiKey?: string;
    };
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const { model, backend } = getModel(body.anthropicKey, body.openaiKey);
    const { text } = await generateText({
      model,
      system:
        "You are AURA Studio, an AI assistant specialized in creating YouTube and social media content. Be concise, creative, and optimize for engagement. Format output clearly.",
      prompt,
      maxTokens: 1024,
    });

    return NextResponse.json({ text, backend });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
