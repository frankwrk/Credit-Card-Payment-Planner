# AI Safety Spec

## Document Metadata
- Title: AI Safety Spec
- Status: Draft
- Owner: TBD
- Last updated: 2026-02-02

## Scope (What AI is allowed to do)

AI features are explicitly scoped to explanations, coaching, and scenario exploration. AI must not directly determine payment amounts or dates without deterministic verification.

AI may:
- Generate natural-language explanations of deterministic solver outputs.
- Answer user questions using user-provided or app-derived structured data (UserFinancialProfile, card metadata, plan history).
- Propose candidate alternative actions or plan adjustments, provided they are validated by the deterministic solver before being shown as actionable.
- Summarize trends and progress (e.g., utilization trajectory, payment punctuality) using computed metrics.

## Hard Prohibitions (What AI must never do)

AI must never:
- Move money, initiate payments, or provide instructions that imply the app executes transfers.
- Claim guaranteed outcomes (e.g., "this will raise your credit score" or "the bank will increase your limit").
- Invent issuer-specific policies or pretend to know confidential bank rules.
- Override user-configured constraints silently (cash buffer, minimum payments, due dates).
- Use raw transaction-level details in prompts unless explicitly enabled by the user and privacy-reviewed.
- Store or reveal sensitive secrets (Plaid tokens, passwords, MFA codes).

## Deterministic Verification Gate

Any AI-proposed action must pass a verification step:
1. AI proposes a candidate adjustment (e.g., additional pre-close payment).
2. Deterministic solver recomputes plan under constraints.
3. UI shows only solver-verified actions; AI output is displayed as explanation or context.

If verification fails, UI must present:
- why it failed (cash constraint, minimum payment risk, missing dates)
- what user input is needed to proceed

## Disclosure & Provenance

All AI outputs must include:
- Data used: "Based on your card details and last N plan snapshots"
- Confidence label: High / Medium / Low (rule-based, not model-generated)
- Disclaimer: No guarantees; issuer policies vary; informational guidance only

## Memory & Learning Policy

AI "learning" is implemented via a UserFinancialProfile derived from user actions and snapshots.

- Store derived metrics (cadence, slopes, preferences), not raw chat.
- Profile updates are deterministic and auditable.
- Users can reset or disable personalization.

## Evaluation Checklist (Required for AI-related PRs)

- No contradictions between AI text and solver output.
- No guarantee language.
- No issuer-policy hallucinations.
- Missing data triggers deterministic prompts (ask user), not guesses.
- Privacy: prompt contents minimized; no raw secrets.
- Tests added: schema validation and golden examples for common questions.
