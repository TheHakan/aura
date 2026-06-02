import { getDb } from "@/lib/db";
import { workspaces, workspaceMembers } from "@aura/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreatePersonalWorkspace(userId: string) {
  const db = getDb();

  const rows = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId))
    .limit(1);

  if (rows.length > 0) return rows[0];

  const slug = `ws-${userId.replace(/-/g, "").slice(0, 12)}`;
  const [workspace] = await db
    .insert(workspaces)
    .values({ name: "My Workspace", slug, ownerId: userId })
    .returning();

  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId,
    role: "owner",
  });

  return workspace;
}
