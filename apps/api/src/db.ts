import postgres from "postgres";
import { drizzle, sql, type PostgresJsDatabase } from "@ccpp/shared/drizzle";
import { schema } from "./dbSchema.js";
import { env } from "./env.js";

export type Database = PostgresJsDatabase<typeof schema>;

const sslSetting = env.DB_SSL === "disable" ? false : env.DB_SSL;

export const pool = postgres(env.SUPABASE_DATABASE_URL, {
  max: env.DB_POOL_MAX,
  ssl: sslSetting,
  options: "-c search_path=public",
});

export const db: Database = drizzle(pool, { schema });

export async function withRls<T>(
  userId: string,
  work: (tx: Database) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('request.jwt.claim.sub', ${userId}, true)`
    );
    await tx.execute(
      sql`select set_config('request.jwt.claims', ${JSON.stringify({ sub: userId })}, true)`
    );
    await tx.execute(sql`select set_config('role', ${env.DB_AUTH_ROLE}, true)`);
    await tx.execute(sql`select set_config('search_path', 'public', true)`);
    return work(tx);
  });
}
