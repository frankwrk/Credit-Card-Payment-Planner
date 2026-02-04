import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const env = {
  SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL,
  DB_SSL: process.env.DB_SSL ?? "require",
};

if (!env.SUPABASE_DATABASE_URL) {
  console.error("Missing SUPABASE_DATABASE_URL in environment.");
  process.exit(1);
}

const sslSetting = env.DB_SSL === "disable" ? false : env.DB_SSL;

const sql = postgres(env.SUPABASE_DATABASE_URL, {
  max: 1,
  ssl: sslSetting,
});

const fileDir = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(fileDir, "../../../packages/shared/migrations");

async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      run_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

async function getAppliedMigrations() {
  const rows = await sql`SELECT name FROM schema_migrations ORDER BY name`;
  return new Set(rows.map((row) => row.name));
}

async function runMigration(file) {
  const fullPath = path.join(migrationsDir, file);
  const contents = await fs.readFile(fullPath, "utf8");

  await sql.begin(async (tx) => {
    await tx.unsafe(contents);
    await tx`INSERT INTO schema_migrations (name) VALUES (${file})`;
  });
}

async function main() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const pending = files.filter((file) => !applied.has(file));

  if (process.argv.includes("--status")) {
    console.log("Applied migrations:");
    if (applied.size === 0) {
      console.log("- (none)");
    } else {
      for (const name of applied) {
        console.log(`- ${name}`);
      }
    }

    console.log("\nPending migrations:");
    if (pending.length === 0) {
      console.log("- (none)");
    } else {
      for (const name of pending) {
        console.log(`- ${name}`);
      }
    }
    return;
  }

  if (pending.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const file of pending) {
    console.log(`Running migration: ${file}`);
    await runMigration(file);
  }

  console.log("Migrations complete.");
}

try {
  await main();
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
