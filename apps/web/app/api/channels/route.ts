import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { channels } from "@aura/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    const rows = await db
      .select({
        id: channels.id,
        name: channels.name,
        handle: channels.handle,
        thumbnailUrl: channels.thumbnailUrl,
        subscriberCount: channels.subscriberCount,
        youtubeChannelId: channels.youtubeChannelId,
        updatedAt: channels.updatedAt,
      })
      .from(channels)
      .where(eq(channels.workspaceId, workspace.id))
      .orderBy(desc(channels.updatedAt));

    return NextResponse.json({ channels: rows });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch channels";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
