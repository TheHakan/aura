import { getAllUserSettings } from "@/lib/settings";
import { getModelFromSettings } from "./clients";
import type { LanguageModelV1 } from "ai";

/**
 * Resolves the best AI model for a given user.
 * Reads the user's saved API keys from the DB, then falls back to env vars.
 */
export async function getModelForUser(
  userId?: string | null,
): Promise<{ model: LanguageModelV1; backend: string }> {
  if (!userId) return getModelFromSettings();

  const settings = await getAllUserSettings(userId);
  return getModelFromSettings({
    anthropicKey: settings["ANTHROPIC_API_KEY"],
    openaiKey: settings["OPENAI_API_KEY"],
    groqKey: settings["GROQ_API_KEY"],
    ollamaBaseUrl: settings["OLLAMA_BASE_URL"],
    ollamaModel: settings["OLLAMA_MODEL"],
  });
}
