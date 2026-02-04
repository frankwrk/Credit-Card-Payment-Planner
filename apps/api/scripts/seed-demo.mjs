import "dotenv/config";
import postgres from "postgres";

const userId = process.env.DEMO_USER_ID;

if (!userId) {
  console.error("Missing DEMO_USER_ID. Provide a Clerk user id (user_...).");
  process.exit(1);
}

const email = process.env.DEMO_EMAIL ?? null;
const username = process.env.DEMO_USERNAME ?? null;
const reset = process.env.DEMO_RESET === "true";

const sslSetting = process.env.DB_SSL === "disable" ? false : process.env.DB_SSL ?? "require";

if (!process.env.SUPABASE_DATABASE_URL) {
  console.error("Missing SUPABASE_DATABASE_URL in environment.");
  process.exit(1);
}

const sql = postgres(process.env.SUPABASE_DATABASE_URL, {
  max: 1,
  ssl: sslSetting,
});

const now = new Date().toISOString();

const cards = [
  {
    name: "Cycl Demo Visa",
    issuer: "Chase",
    creditLimitCents: 520000,
    currentBalanceCents: 186000,
    minimumPaymentCents: 3200,
    aprBps: 1999,
    statementCloseDay: 20,
    dueDateDay: 5,
    excludeFromOptimization: false,
  },
  {
    name: "Cycl Demo Mastercard",
    issuer: "Amex",
    creditLimitCents: 380000,
    currentBalanceCents: 94000,
    minimumPaymentCents: 2100,
    aprBps: 2299,
    statementCloseDay: 14,
    dueDateDay: 1,
    excludeFromOptimization: false,
  },
  {
    name: "Cycl Demo Store Card",
    issuer: "Target",
    creditLimitCents: 120000,
    currentBalanceCents: 38000,
    minimumPaymentCents: 900,
    aprBps: 2599,
    statementCloseDay: 2,
    dueDateDay: 20,
    excludeFromOptimization: false,
  },
];

async function resetUserData() {
  await sql`DELETE FROM plans WHERE user_id = ${userId}`;
  await sql`DELETE FROM cards WHERE user_id = ${userId}`;
  await sql`DELETE FROM plan_preferences WHERE user_id = ${userId}`;
}

async function upsertUser() {
  await sql`
    INSERT INTO users (id, email, username, created_at, updated_at)
    VALUES (${userId}, ${email}, ${username}, ${now}, ${now})
    ON CONFLICT (id)
    DO UPDATE SET
      email = EXCLUDED.email,
      username = EXCLUDED.username,
      updated_at = EXCLUDED.updated_at
  `;
}

async function upsertPlanPreferences() {
  await sql`
    INSERT INTO plan_preferences (user_id, strategy, available_cash_cents, created_at, updated_at)
    VALUES (${userId}, 'utilization', 60000, ${now}, ${now})
    ON CONFLICT (user_id)
    DO UPDATE SET
      strategy = EXCLUDED.strategy,
      available_cash_cents = EXCLUDED.available_cash_cents,
      updated_at = EXCLUDED.updated_at
  `;
}

async function insertCards() {
  for (const card of cards) {
    await sql`
      INSERT INTO cards (
        user_id,
        name,
        issuer,
        credit_limit_cents,
        current_balance_cents,
        minimum_payment_cents,
        apr_bps,
        statement_close_day,
        due_date_day,
        exclude_from_optimization,
        created_at,
        updated_at
      )
      VALUES (
        ${userId},
        ${card.name},
        ${card.issuer},
        ${card.creditLimitCents},
        ${card.currentBalanceCents},
        ${card.minimumPaymentCents},
        ${card.aprBps},
        ${card.statementCloseDay},
        ${card.dueDateDay},
        ${card.excludeFromOptimization},
        ${now},
        ${now}
      )
    `;
  }
}

async function main() {
  if (reset) {
    console.log("Resetting existing data for user...");
    await resetUserData();
  }

  await upsertUser();
  await upsertPlanPreferences();
  await insertCards();

  console.log("Demo data seeded for:", userId);
}

try {
  await main();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
