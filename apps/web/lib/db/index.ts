import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@aura/db/schema";

export type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let _db: DbInstance | null = null;

export function getDb(): DbInstance {
  if (_db) return _db;
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured.\n" +
        "  1. Copy .env.example → .env and fill in DATABASE_URL\n" +
        "  2. Start PostgreSQL: docker compose -f docker/docker-compose.dev.yml up -d",
    );
  }
  _db = drizzle(postgres(url, { prepare: false }), { schema });
  return _db;
}
