import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { model?: string };
    const model = body.model?.trim();
    if (!model)
      return NextResponse.json({ error: "model is required" }, { status: 400 });

    const ollamaUrl =
      process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";

    // Fire-and-forget — pull is slow, client polls /api/ai/providers for completion
    void fetch(`${ollamaUrl}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: model, stream: false }),
    }).catch(() => {});

    return NextResponse.json({ status: "pulling", model }, { status: 202 });
  } catch {
    return NextResponse.json(
      { error: "Failed to start pull" },
      { status: 500 },
    );
  }
}
