import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

// ─── Ollama (local, offline-first) ───────────────────────────────────────────
export function getOllamaClient(baseURL?: string) {
  return createOpenAI({
    baseURL:
      (baseURL ?? process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434") +
      "/v1",
    apiKey: "ollama", // Ollama doesn't need a real key
  });
}

export const DEFAULT_OLLAMA_MODEL = process.env["OLLAMA_MODEL"] ?? "llama3.2";

// ─── Cloud providers (optional, BYOK) ────────────────────────────────────────
export function getAnthropicClient(apiKey?: string) {
  return createAnthropic({
    apiKey: apiKey ?? process.env["ANTHROPIC_API_KEY"],
  });
}

export function getOpenAIClient(apiKey?: string) {
  return createOpenAI({
    apiKey: apiKey ?? process.env["OPENAI_API_KEY"],
  });
}

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
export const DEFAULT_OPENAI_MODEL = "gpt-4o";

// ─── Unified model selector ───────────────────────────────────────────────────
// Priority: Ollama (local) → Anthropic → OpenAI
// Returns the model and a label so routes can log which backend is active.
export function getModel(
  userAnthropicKey?: string,
  userOpenAIKey?: string,
): { model: LanguageModelV1; backend: string } {
  const ollamaURL = process.env["OLLAMA_BASE_URL"];
  const anthropicKey = userAnthropicKey ?? process.env["ANTHROPIC_API_KEY"];
  const openaiKey = userOpenAIKey ?? process.env["OPENAI_API_KEY"];

  // 1. Local Ollama — works fully offline
  if (ollamaURL || (!anthropicKey && !openaiKey)) {
    const client = getOllamaClient(ollamaURL);
    return {
      model: client(DEFAULT_OLLAMA_MODEL),
      backend: `ollama:${DEFAULT_OLLAMA_MODEL}`,
    };
  }

  // 2. Anthropic (cloud)
  if (anthropicKey) {
    const client = getAnthropicClient(anthropicKey);
    return {
      model: client(DEFAULT_ANTHROPIC_MODEL),
      backend: `anthropic:${DEFAULT_ANTHROPIC_MODEL}`,
    };
  }

  // 3. OpenAI (cloud)
  const client = getOpenAIClient(openaiKey!);
  return {
    model: client(DEFAULT_OPENAI_MODEL),
    backend: `openai:${DEFAULT_OPENAI_MODEL}`,
  };
}

/** @deprecated Use getModel() instead */
export const DEFAULT_MODEL = DEFAULT_ANTHROPIC_MODEL;
