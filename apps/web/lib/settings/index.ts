import { getDb } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/vault/crypto";
import { userSettings } from "@aura/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserSetting(
  userId: string,
  key: string,
): Promise<string | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(userSettings)
    .where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)))
    .limit(1);
  if (!rows[0]) return null;
  try {
    return await decrypt(rows[0].encryptedValue, rows[0].nonce);
  } catch {
    return null;
  }
}

export async function setUserSetting(
  userId: string,
  key: string,
  value: string,
): Promise<void> {
  const db = getDb();
  const { ciphertext, nonce } = await encrypt(value);
  await db
    .insert(userSettings)
    .values({ userId, key, encryptedValue: ciphertext, nonce })
    .onConflictDoUpdate({
      target: [userSettings.userId, userSettings.key],
      set: { encryptedValue: ciphertext, nonce, updatedAt: new Date() },
    });
}

export async function deleteUserSetting(
  userId: string,
  key: string,
): Promise<void> {
  const db = getDb();
  await db
    .delete(userSettings)
    .where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)));
}

export async function getUserSettingKeys(userId: string): Promise<Set<string>> {
  const db = getDb();
  const rows = await db
    .select({ key: userSettings.key })
    .from(userSettings)
    .where(eq(userSettings.userId, userId));
  return new Set(rows.map((r) => r.key));
}

export async function getAllUserSettings(
  userId: string,
): Promise<Record<string, string>> {
  const db = getDb();
  const rows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  const result: Record<string, string> = {};
  await Promise.all(
    rows.map(async (row) => {
      try {
        result[row.key] = await decrypt(row.encryptedValue, row.nonce);
      } catch {
        // skip corrupted entries
      }
    }),
  );
  return result;
}
