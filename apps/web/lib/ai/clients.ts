import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

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

export const DEFAULT_MODEL = "claude-sonnet-4-20250514";
export const DEFAULT_OPENAI_MODEL = "gpt-4o";
