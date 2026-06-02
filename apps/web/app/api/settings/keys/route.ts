import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import {
  getUserSettingKeys,
  setUserSetting,
  deleteUserSetting,
} from "@/lib/settings";

export const KNOWN_SETTING_KEYS = [
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "GROQ_API_KEY",
  "GEMINI_API_KEY",
  "MISTRAL_API_KEY",
  "OLLAMA_BASE_URL",
  "OLLAMA_MODEL",
] as const;

export type SettingKey = (typeof KNOWN_SETTING_KEYS)[number];

const ENV_MAP: Partial<Record<SettingKey, string>> = {
  GEMINI_API_KEY: "GOOGLE_API_KEY",
};

function isKnownKey(key: string): key is SettingKey {
  return KNOWN_SETTING_KEYS.includes(key as SettingKey);
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const savedKeys = await getUserSettingKeys(session.user.id);

    const keys = KNOWN_SETTING_KEYS.map((key) => ({
      key,
      isSetInDb: savedKeys.has(key),
      isSetInEnv: !!process.env[ENV_MAP[key] ?? key],
    }));

    return NextResponse.json({ keys });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { key?: string; value?: string };
    const { key, value } = body;

    if (!key || !isKnownKey(key))
      return NextResponse.json({ error: "Unknown key" }, { status: 400 });
    if (!value || typeof value !== "string" || !value.trim())
      return NextResponse.json({ error: "Value is required" }, { status: 400 });

    await setUserSetting(session.user.id, key, value.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save setting";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { key?: string };
    const { key } = body;

    if (!key || !isKnownKey(key))
      return NextResponse.json({ error: "Unknown key" }, { status: 400 });

    await deleteUserSetting(session.user.id, key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete setting";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
