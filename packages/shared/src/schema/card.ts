import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    issuer: text("issuer"),
    creditLimitCents: integer("credit_limit_cents").notNull(),
    currentBalanceCents: integer("current_balance_cents").notNull(),
    minimumPaymentCents: integer("minimum_payment_cents").notNull(),
    aprBps: integer("apr_bps").notNull(),
    statementCloseDay: integer("statement_close_day").notNull(),
    dueDateDay: integer("due_date_day").notNull(),
    excludeFromOptimization: boolean("exclude_from_optimization").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("cards_user_id_idx").on(table.userId),
  })
);

export const insertCardSchema = createInsertSchema(cards);
export const selectCardSchema = createSelectSchema(cards);

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
