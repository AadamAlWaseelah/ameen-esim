import { config } from "dotenv";
// Match the runtime + scripts: prefer .env.local, fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
