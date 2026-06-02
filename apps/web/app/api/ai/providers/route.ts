import { NextResponse } from "next/server";

export async function GET() {
  const ollamaUrl = process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";
  const ollamaModel = process.env["OLLAMA_MODEL"] ?? "llama3.2";

  const hasOllamaUrl = !!process.env["OLLAMA_BASE_URL"];
  const anthropicKey = !!process.env["ANTHROPIC_API_KEY"];
  const openaiKey = !!process.env["OPENAI_API_KEY"];
  const groqKey = !!process.env["GROQ_API_KEY"];
  const googleKey = !!process.env["GOOGLE_API_KEY"];
  const mistralKey = !!process.env["MISTRAL_API_KEY"];

  // Determine active provider label
  let active = `ollama:${ollamaModel}`;
  if (!hasOllamaUrl && !anthropicKey && !openaiKey) {
    active = `ollama:${ollamaModel} (auto)`;
  } else if (!hasOllamaUrl && anthropicKey) {
    active = `anthropic:claude-sonnet-4-20250514`;
  } else if (!hasOllamaUrl && openaiKey) {
    active = `openai:gpt-4o`;
  }

  // Check if Ollama is reachable
  let ollamaRunning = false;
  let installedModels: Array<{
    name: string;
    size: number;
    modifiedAt: string;
  }> = [];

  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(3_000),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        models?: Array<{ name: string; size: number; modified_at: string }>;
      };
      ollamaRunning = true;
      installedModels = (data.models ?? []).map((m) => ({
        name: m.name,
        size: m.size,
        modifiedAt: m.modified_at,
      }));
    }
  } catch {
    ollamaRunning = false;
  }

  return NextResponse.json({
    active,
    ollama: {
      running: ollamaRunning,
      url: ollamaUrl,
      model: ollamaModel,
      installedModels,
    },
    cloud: {
      anthropic: anthropicKey,
      openai: openaiKey,
      groq: groqKey,
      google: googleKey,
      mistral: mistralKey,
    },
  });
}
