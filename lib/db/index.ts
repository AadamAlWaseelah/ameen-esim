import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

/**
 * Drizzle client over Neon's serverless HTTP driver.
 *
 * Local-first: we do NOT connect at import time. The client is created lazily
 * on first use, so the marketing site renders in development with no
 * DATABASE_URL set. A missing URL throws a clear error only when the DB is
 * actually queried.
 */
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon connection string to .env.local " +
        "(see .env.example). Until then the database layer is unavailable."
    );
  }

  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };
