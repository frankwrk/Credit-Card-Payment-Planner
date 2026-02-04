import { PlanSnapshot } from "@ccpp/shared/ai";
import { PlanSnapshotRecord, Strategy } from "@ccpp/shared/mobile";
import { apiRequest, ApiError } from "./api";

type PlanResponse = {
  plan: PlanSnapshot;
  strategy: Strategy;
  availableCashCents: number;
  totalPaymentCents: number;
};

function toRecord(response: PlanResponse): PlanSnapshotRecord {
  return PlanSnapshotRecord.parse({
    id: response.plan.planId,
    generatedAt: response.plan.generatedAt,
    strategy: response.strategy,
    availableCashCents: response.availableCashCents,
    totalPaymentCents: response.totalPaymentCents,
    snapshot: response.plan,
  });
}

export async function getCurrentPlan(
  token: string
): Promise<PlanSnapshotRecord | null> {
  try {
    const response = await apiRequest<PlanResponse>("/plan/current", token);
    return toRecord(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generatePlan(
  token: string,
  availableCashCents: number,
  strategy: Strategy
): Promise<PlanSnapshotRecord> {
  const response = await apiRequest<PlanResponse>("/plan/generate", token, {
    method: "POST",
    body: JSON.stringify({ availableCashCents, strategy }),
  });
  return toRecord(response);
}
