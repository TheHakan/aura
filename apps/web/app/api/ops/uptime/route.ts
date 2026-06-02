import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { uptimeChecks } from "@aura/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    const rows = await db
      .select()
      .from(uptimeChecks)
      .where(eq(uptimeChecks.workspaceId, workspace.id))
      .orderBy(desc(uptimeChecks.createdAt));

    return NextResponse.json({ checks: rows });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch checks";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { name?: string; url?: string };
    if (!body.name?.trim() || !body.url?.trim()) {
      return NextResponse.json(
        { error: "name and url are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    // Immediate ping
    let isUp = false;
    let responseTimeMs = "";
    try {
      const start = Date.now();
      const res = await fetch(body.url.trim(), {
        signal: AbortSignal.timeout(10_000),
      });
      responseTimeMs = String(Date.now() - start);
      isUp = res.ok;
    } catch {
      isUp = false;
    }

    const [check] = await db
      .insert(uptimeChecks)
      .values({
        workspaceId: workspace.id,
        name: body.name.trim(),
        url: body.url.trim(),
        isUp,
        responseTimeMs,
        lastCheckedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ check }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add monitor";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
