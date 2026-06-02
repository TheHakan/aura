import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { decrypt } from "@/lib/vault/crypto";
import { vaultItems } from "@aura/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/vault/[id] — reveal the decrypted value (single item)
export async function GET(
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

    const [item] = await db
      .select()
      .from(vaultItems)
      .where(
        and(eq(vaultItems.id, id), eq(vaultItems.workspaceId, workspace.id)),
      )
      .limit(1);

    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const value = await decrypt(item.encryptedValue, item.nonce);
    return NextResponse.json({ value });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to reveal secret";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/vault/[id]
export async function DELETE(
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

    const deleted = await db
      .delete(vaultItems)
      .where(
        and(eq(vaultItems.id, id), eq(vaultItems.workspaceId, workspace.id)),
      )
      .returning({ id: vaultItems.id });

    if (!deleted.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete secret";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
