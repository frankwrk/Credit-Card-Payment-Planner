import type { CardMeta, PlanSnapshot } from "../ai";
import type { Card, NewCard, NewPlan, Plan } from "./schema";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysInMonthUtc(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function nextDateFromDayOfMonth(dayOfMonth: number, referenceDate: Date): Date {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const todayUtc = new Date(Date.UTC(year, month, referenceDate.getUTCDate()));
  const currentDay = Math.min(dayOfMonth, daysInMonthUtc(year, month));
  const candidate = new Date(Date.UTC(year, month, currentDay));

  if (candidate >= todayUtc) {
    return candidate;
  }

  const nextMonth = month + 1;
  const nextYear = year + Math.floor(nextMonth / 12);
  const nextMonthIndex = nextMonth % 12;
  const nextDay = Math.min(dayOfMonth, daysInMonthUtc(nextYear, nextMonthIndex));

  return new Date(Date.UTC(nextYear, nextMonthIndex, nextDay));
}

function parseDayOfMonth(isoDate: string, label: string): number {
  if (!ISO_DATE_REGEX.test(isoDate)) {
    throw new Error(`${label} must be in YYYY-MM-DD format.`);
  }

  return Number.parseInt(isoDate.slice(8, 10), 10);
}

function requireNumber(value: number | null | undefined, label: string): number {
  if (value == null || Number.isNaN(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function toDate(value: string, label: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${label} must be a valid ISO date-time string.`);
  }

  return parsed;
}

export function dbCardToCardMeta(card: Card, referenceDate: Date = new Date()): CardMeta {
  const dueDate = toIsoDate(nextDateFromDayOfMonth(card.dueDateDay, referenceDate));
  const statementCloseDate = toIsoDate(nextDateFromDayOfMonth(card.statementCloseDay, referenceDate));

  return {
    cardId: card.id,
    issuer: card.issuer ?? card.name,
    cardName: card.name,
    creditLimitCents: card.creditLimitCents,
    aprBps: card.aprBps,
    dueDate,
    statementCloseDate,
    minimumDueCents: card.minimumPaymentCents,
  };
}

export type CardMetaToDbCardInput = {
  userId: string;
  currentBalanceCents: number;
  statementCloseDay?: number;
  dueDateDay?: number;
  excludeFromOptimization?: boolean;
};

export function cardMetaToDbCard(card: CardMeta, input: CardMetaToDbCardInput): NewCard {
  const statementCloseDay =
    card.statementCloseDate != null
      ? parseDayOfMonth(card.statementCloseDate, "statementCloseDate")
      : input.statementCloseDay;

  const dueDateDay =
    card.dueDate != null ? parseDayOfMonth(card.dueDate, "dueDate") : input.dueDateDay;

  if (statementCloseDay == null || dueDateDay == null) {
    throw new Error("statementCloseDay and dueDateDay are required when dates are missing.");
  }

  return {
    id: card.cardId,
    userId: input.userId,
    name: card.cardName,
    issuer: card.issuer,
    creditLimitCents: requireNumber(card.creditLimitCents, "creditLimitCents"),
    currentBalanceCents: requireNumber(input.currentBalanceCents, "currentBalanceCents"),
    minimumPaymentCents: requireNumber(card.minimumDueCents, "minimumDueCents"),
    aprBps: requireNumber(card.aprBps, "aprBps"),
    statementCloseDay,
    dueDateDay,
    excludeFromOptimization: input.excludeFromOptimization ?? false,
  };
}

export type PlanSnapshotToDbPlanInput = {
  userId: string;
  strategy: string;
  availableCashCents: number;
  totalPaymentCents: number;
};

export function planSnapshotToDbPlan(snapshot: PlanSnapshot, input: PlanSnapshotToDbPlanInput): NewPlan {
  return {
    id: snapshot.planId,
    userId: input.userId,
    generatedAt: toDate(snapshot.generatedAt, "generatedAt"),
    strategy: input.strategy,
    availableCashCents: input.availableCashCents,
    totalPaymentCents: input.totalPaymentCents,
    snapshotJson: snapshot as Record<string, unknown>,
  };
}

export function dbPlanToPlanSnapshot(plan: Plan): PlanSnapshot {
  const snapshot = plan.snapshotJson as PlanSnapshot;
  const generatedAt =
    plan.generatedAt instanceof Date
      ? plan.generatedAt.toISOString()
      : new Date(plan.generatedAt as unknown as string).toISOString();

  return {
    ...snapshot,
    planId: plan.id,
    generatedAt,
  };
}
