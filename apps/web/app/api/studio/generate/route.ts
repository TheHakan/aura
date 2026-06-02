import { generateText } from "ai";
import { getModelForUser } from "@/lib/ai/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      prompt?: string;
    };
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const { model, backend } = await getModelForUser(session?.user?.id);
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
