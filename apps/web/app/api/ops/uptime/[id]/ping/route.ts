import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { uptimeChecks } from "@aura/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    const [check] = await db
      .select()
      .from(uptimeChecks)
      .where(
        and(
          eq(uptimeChecks.id, id),
          eq(uptimeChecks.workspaceId, workspace.id),
        ),
      )
      .limit(1);

    if (!check)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    let isUp = false;
    let responseTimeMs = "";
    try {
      const start = Date.now();
      const res = await fetch(check.url, {
        signal: AbortSignal.timeout(10_000),
      });
      responseTimeMs = String(Date.now() - start);
      isUp = res.ok;
    } catch {
      isUp = false;
    }

    const [updated] = await db
      .update(uptimeChecks)
      .set({ isUp, responseTimeMs, lastCheckedAt: new Date() })
      .where(eq(uptimeChecks.id, id))
      .returning();

    return NextResponse.json({ check: updated });
  } catch {
    return NextResponse.json({ error: "Ping failed" }, { status: 500 });
  }
}
