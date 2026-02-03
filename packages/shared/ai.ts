import { z } from "zod";

/**
 * AI schema boundary for the app.
 *
 * Design goals:
 * - Store structured, auditable facts and derived metrics.
 * - Keep deterministic solver in control of recommendations.
 * - Use AI only for explanations, coaching, and proposing *candidate* alternatives.
 */

/**
 * ISO date formats used across the app.
 * - ISODate: YYYY-MM-DD
 * - ISODateTime: full ISO string
 */
export const ISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const ISODateTime = z.string(); // keep flexible; validate at IO boundaries if needed

export const Confidence = z.enum(["high", "medium", "low"]);

export const ActionType = z.enum(["BEFORE_STATEMENT_CLOSE", "BY_DUE_DATE"]);

export const ReasonTag = z.enum([
  "utilization_reporting",
  "minimum_payment",
  "apr_priority",
  "cash_constraint",
  "data_missing",
  "user_preference",
  "stability",
]);

/**
 * Minimal card facts needed for AI assistance.
 * NOTE: Do not store secrets or bank tokens here.
 */
export const CardMeta = z.object({
  cardId: z.string().min(1),
  issuer: z.string().min(1),
  cardName: z.string().min(1),
  creditLimitCents: z.number().int().nonnegative().optional(),
  aprBps: z.number().int().nonnegative().optional(), // basis points, e.g. 1999 = 19.99%
  dueDate: ISODate.optional(),
  statementCloseDate: ISODate.optional(),
  minimumDueCents: z.number().int().nonnegative().optional(),
});

export type CardMeta = z.infer<typeof CardMeta>;

/**
 * App-derived profile used to personalize AI responses.
 * This is NOT “model training”; it is computed features.
 */
export const IncomeCadence = z.enum(["weekly", "biweekly", "semimonthly", "monthly", "irregular", "unknown"]);

export const UserPreferences = z.object({
  timezone: z.string().min(1).default("America/New_York"),
  cashBufferCents: z.number().int().nonnegative().default(0),
  preferredPaymentWeekdays: z.array(z.number().int().min(0).max(6)).default([]), // 0=Sun..6=Sat
  avoidLowBalanceAnxiety: z.boolean().default(true),
});

export type UserPreferences = z.infer<typeof UserPreferences>;

export const UtilizationStats = z.object({
  currentUtilization: z.number().min(0).max(10), // allow >1 if limits missing; treat carefully in UI
  utilization30dSlope: z.number().optional(), // + means rising
  utilization90dSlope: z.number().optional(),
});

export const DebtProgress = z.object({
  totalDebtCents: z.number().int().nonnegative(),
  debt30dSlopeCents: z.number().optional(), // + rising, - falling
  debt90dSlopeCents: z.number().optional(),
  minimumOnlyCycles90d: z.number().int().nonnegative().optional(),
});

export const UserFinancialProfile = z.object({
  userId: z.string().min(1),
  updatedAt: ISODateTime,
  incomeCadence: IncomeCadence.default("unknown"),
  typicalIncomeDay: z.number().int().min(1).max(31).optional(),
  typicalIncomeAmountCents: z.number().int().nonnegative().optional(),
  primarySpendingCardId: z.string().min(1).optional(),
  utilization: UtilizationStats.optional(),
  debt: DebtProgress.optional(),
  preferences: UserPreferences.default({} as any),
  notes: z.array(z.string().max(240)).default([]),
});

export type UserFinancialProfile = z.infer<typeof UserFinancialProfile>;

/**
 * Plan structures mirrored for AI prompts.
 */
export const PlanAction = z.object({
  cardId: z.string().min(1),
  cardName: z.string().min(1),
  actionType: ActionType,
  amountCents: z.number().int().nonnegative(),
  targetDate: ISODate,
  priority: z.number().min(0).max(1),
  reason: z.string().min(1).max(200),
  reasonTags: z.array(ReasonTag).default([]),
});

export type PlanAction = z.infer<typeof PlanAction>;

export const PlanSnapshot = z.object({
  planId: z.string().min(1),
  generatedAt: ISODateTime,
  cycleLabel: z.string().min(1).default("This Cycle"),
  focusSummary: z.array(z.string().max(140)).default([]),
  nextAction: PlanAction.optional(),
  actions: z.array(PlanAction).default([]),
  portfolio: z.object({
    utilization: z.number().min(0).max(10).optional(),
    confidence: Confidence.default("medium"),
  }),
});

export type PlanSnapshot = z.infer<typeof PlanSnapshot>;

/**
 * AI request/response boundary.
 */
export const AIIntent = z.enum([
  "explain_plan",
  "what_if",
  "card_limit_increase",
  "reduce_interest",
  "avoid_late_payment",
  "progress_summary",
  "data_help",
]);

export const AIQuestion = z.object({
  questionId: z.string().min(1),
  askedAt: ISODateTime,
  intent: AIIntent,
  userText: z.string().min(1).max(2000),
  cardId: z.string().min(1).optional(),
  constraints: z
    .object({
      maxAdditionalPaymentCents: z.number().int().nonnegative().optional(),
      earliestDate: ISODate.optional(),
      latestDate: ISODate.optional(),
    })
    .optional(),
});

export type AIQuestion = z.infer<typeof AIQuestion>;

/**
 * Candidate actions proposed by AI must be verified by the deterministic solver.
 */
export const CandidateAction = z.object({
  cardId: z.string().min(1),
  actionType: ActionType,
  amountCents: z.number().int().nonnegative(),
  targetDate: ISODate,
  rationale: z.string().min(1).max(240),
});

export type CandidateAction = z.infer<typeof CandidateAction>;

export const VerificationStatus = z.enum(["verified", "rejected", "needs_more_data"]);

export const VerificationResult = z.object({
  status: VerificationStatus,
  reasons: z.array(z.string().max(240)).default([]),
  verifiedPlan: PlanSnapshot.optional(),
});

export type VerificationResult = z.infer<typeof VerificationResult>;

export const AIAnswer = z.object({
  answerId: z.string().min(1),
  questionId: z.string().min(1),
  generatedAt: ISODateTime,
  summary: z.string().min(1).max(1800),
  candidates: z.array(CandidateAction).default([]),
  confidence: Confidence,
  dataUsed: z.array(z.string().max(140)).default([]),
  disclaimer: z
    .string()
    .default(
      "Informational guidance only. No guarantees. Issuer policies vary; verify details with your card issuer."
    ),
});

export type AIAnswer = z.infer<typeof AIAnswer>;

/**
 * Helper validators for IO boundaries.
 */
export function parseAIQuestion(input: unknown): AIQuestion {
  return AIQuestion.parse(input);
}

export function parseAIAnswer(input: unknown): AIAnswer {
  return AIAnswer.parse(input);
}
