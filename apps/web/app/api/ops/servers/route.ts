import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { servers } from "@aura/db/schema";
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
        id: servers.id,
        name: servers.name,
        host: servers.host,
        coolifyServerId: servers.coolifyServerId,
        createdAt: servers.createdAt,
      })
      .from(servers)
      .where(eq(servers.workspaceId, workspace.id))
      .orderBy(desc(servers.createdAt));

    return NextResponse.json({ servers: rows });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch servers";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as {
      name?: string;
      host?: string;
      coolifyServerId?: string;
    };

    if (!body.name?.trim())
      return NextResponse.json(
        { error: "Server name is required" },
        { status: 400 },
      );

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    const [server] = await db
      .insert(servers)
      .values({
        workspaceId: workspace.id,
        name: body.name.trim(),
        host: body.host?.trim() || null,
        coolifyServerId: body.coolifyServerId?.trim() || null,
      })
      .returning({
        id: servers.id,
        name: servers.name,
        host: servers.host,
        coolifyServerId: servers.coolifyServerId,
        createdAt: servers.createdAt,
      });

    return NextResponse.json({ server }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
