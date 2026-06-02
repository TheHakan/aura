import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { getOrCreatePersonalWorkspace } from "@/lib/workspace";
import { encrypt } from "@/lib/vault/crypto";
import { vaultItems } from "@aura/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);

    const items = await db
      .select({
        id: vaultItems.id,
        name: vaultItems.name,
        module: vaultItems.module,
        createdAt: vaultItems.createdAt,
        rotationReminderAt: vaultItems.rotationReminderAt,
      })
      .from(vaultItems)
      .where(eq(vaultItems.workspaceId, workspace.id))
      .orderBy(desc(vaultItems.createdAt));

    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch secrets";
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
      module?: string;
      value?: string;
      rotationDays?: number;
    };

    if (!body.name?.trim() || !body.module || !body.value?.trim()) {
      return NextResponse.json(
        { error: "name, module, and value are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const workspace = await getOrCreatePersonalWorkspace(session.user.id);
    const { ciphertext, nonce } = await encrypt(body.value);

    const rotationReminderAt = body.rotationDays
      ? new Date(Date.now() + body.rotationDays * 86_400_000)
      : null;

    const [item] = await db
      .insert(vaultItems)
      .values({
        workspaceId: workspace.id,
        name: body.name.trim(),
        module: body.module,
        encryptedValue: ciphertext,
        nonce,
        rotationReminderAt,
      })
      .returning({
        id: vaultItems.id,
        name: vaultItems.name,
        module: vaultItems.module,
        createdAt: vaultItems.createdAt,
        rotationReminderAt: vaultItems.rotationReminderAt,
      });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save secret";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
