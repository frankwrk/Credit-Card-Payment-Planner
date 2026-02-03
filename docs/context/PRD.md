# Product Requirements Document (PRD)

This document defines **product intent, user-facing behavior, and scope boundaries**.
It does NOT define implementation details or execution order.

Execution order, phases, and engineering constraints are defined in PLANS.md.

## Document Metadata

- Title: Product Requirements Document
- Status: Draft
- Owner: TBD
- Last updated: 2026-02-02

## Product Name (Working)

**Credit Card Payment Planner**

_Working title — branding is explicitly out of scope for MVP._

---

## Executive Summary

This is a mobile app that helps people managing multiple credit cards decide what to pay, when, and why—based on their available cash and chosen strategy. Designed for users with variable income who carry balances month-to-month, it generates cycle-specific payment plans with clear rationale for every recommendation. No money movement, no credit score guarantees—just an explainable tool that replaces spreadsheets and notes.

It is intended for users who want visibility and control rather than automation, and deliberately avoids executing payments or accessing bank accounts in the MVP.

**One-liner (for app store / marketing):**  
Smart payment plans for your credit cards. Know what to pay, when, and why.

---

## 1. Problem Statement

Managing multiple credit cards with different balances, APRs, due dates, and statement closing dates creates ongoing cognitive load and sub-optimal decisions—especially for users who cannot pay all balances in full.

Existing tools focus on:

- Tracking balances
- Budgeting
- Post-hoc credit score explanations

They do **not** help users decide:

- How much to pay
- When to pay
- Which card matters most this cycle under real cash constraints

### Explicit Non-Goals

- Real-time transaction tracking
- Automated payments or transfers
- Credit score prediction or guarantees
- Issuer-specific policy enforcement

---

## 2. Target User

### Primary User (MVP)

- Individual managing multiple credit cards
- Often carries balances
- Actively trying to:
  - Avoid late payments
  - Control utilization
  - Improve long-term credit health
- Currently tracks this manually (notes, spreadsheets, reminders)

### Explicitly Excluded (MVP)

- Businesses
- Joint/household finances
- Users expecting automated payments
- Users seeking credit score guarantees

---

## 3. Product Goals

### Primary Goals

1. Reduce cognitive load when planning card payments
2. Produce clear, trustworthy, cycle-specific recommendations
3. Explain why a recommendation exists
4. Support imperfect or manually entered data gracefully

### Secondary Goals

- Enable future automation (Plaid, widgets) without redesign
- Serve as a strong portfolio artifact demonstrating:
  - System design
  - Financial domain reasoning
  - UX clarity
  - AI used responsibly

---

## 4. Non-Goals (Explicit)

- No money movement
- No credit score prediction or guarantees
- No budgeting features
- No rewards optimization
- No investment features
- No financial advice claims

---

## 5. Core MVP Features

### 5.1 Manual Credit Card Management

Users can add/edit:

- Card name
- Issuer
- Credit limit
- Current balance
- APR
- Minimum payment
- Due date
- Statement close date

All fields are:

- User-editable
- Clearly marked as _Edited_ or _From bank_ (future)

### 5.2 Payment Planning Engine (Solver)

A deterministic engine generates a cycle-specific plan that:

- Never misses minimum payments
- Prioritizes utilization reduction before statement close
- Considers APR only after utilization goals
- Respects a user-defined cash constraint

**Output per card:**

- Payment amount
- Target date
- Timing category:
  - `BEFORE_STATEMENT_CLOSE`
  - `BY_DUE_DATE`
- One-line rationale

### 5.3 “This Cycle” Plan View

Primary screen that answers in **<5 seconds**:

- What should I pay?
- When?
- Why?

**Characteristics:**

- Ordered by impact
- No charts
- Minimal color
- Explicit utilization deltas
- “No action needed today” is a valid state

### 5.4 Explanation (“Why this plan?”)

Explains:

- This cycle’s priorities (dynamic)
- Why statement close matters
- Why certain cards were deprioritized
- Data confidence and manual overrides
- Explicit disclaimer (non-advisory)

### 5.5 Local Snapshot + Widget Readiness

- Each plan produces a `PlanSnapshot`
- Stored locally
- Used by widgets later
- Widgets are read-only surfaces

### 5.6 Functional Invariants

The following rules must hold for all product behavior and future versions:

- **Minimum payments first**: Any generated plan must satisfy all minimum payment requirements before any optimization or discretionary payment.
- **Constraint adherence**: User-defined constraints (cash limits, buffers, due dates) must never be silently overridden.
- **Deterministic planning**: Given the same inputs, the system must always produce the same plan.
- **Explainability**: Every recommended action must include a human-readable rationale.
- **User authority**: Explicit user-entered data always takes precedence over derived or inferred values.

---

## 6. User Experience Principles

- Calm, not motivational
- Explanations > dashboards
- Explicit uncertainty
- Manual control is first-class
- Fewer decisions is success

---

## 7. Success Metrics (MVP)

### Qualitative

- User feels less anxious managing payments
- Plan recommendations feel reasonable and explainable
- App replaces notes/spreadsheets

### Quantitative (Later)

- Daily/weekly app opens
- Override frequency (signal of trust or mismatch)
- Widget engagement (v1.1+)

---

## 8. Risks & Mitigations

| Risk                               | Mitigation                             |
| ---------------------------------- | -------------------------------------- |
| Incorrect assumptions about credit | Conservative heuristics + explanations |
| Over-automation                    | Manual-first design                    |
| Legal exposure                     | Explicit disclaimers, no guarantees    |
| Data inaccuracies                  | Provenance labels + overrides          |

---

## 9. Future Considerations (Out of Scope for MVP)

- Plaid integration (read-only)
- iOS / Android widgets
- Household accounts
- AI-generated alternative scenarios
- Subscription monetization

---

### 10. AI Roles and Boundaries

AI functionality in this product is strictly limited to the following roles:

- **Explanations**: Translating deterministic plan outputs into human-readable reasoning.
- **Coaching**: Providing general guidance and trade-offs based on user behavior and plan history.
- **Candidate proposals**: Suggesting _candidate actions_ or adjustments that must be verified by the deterministic solver before being shown as actionable.

AI must not:

- Directly determine final payment amounts or dates.
- Override solver outputs or user-defined constraints.
- Claim guaranteed outcomes related to credit score or credit limit changes.
- Introduce issuer-specific rules without explicit user-provided context.

All AI-generated candidate actions are subject to solver verification prior to presentation.

## 11. Open Questions (Tracked)

- Should cash availability be manual or inferred first?
- How long should historical snapshots be retained?
- When to suggest (not auto-apply) limit increase requests?

---

### Assumptions

#### User Assumptions

- Users have basic familiarity with credit card concepts: due dates, statement close dates, minimum payments, APR, and credit utilization
- Users know how to find this information on their statements or card issuer apps
- Users are motivated to improve their credit situation (avoid late fees, reduce utilization, pay down debt)
- Users are comfortable with manual data entry for POC phase

#### Product Assumptions

- **Cycle definition:** "This cycle" refers to the current statement period for each card, not a fixed calendar month. Since cards have different statement close dates, the plan considers each card's individual cycle.
- **Single user per device:** No multi-profile, household, or shared account support in POC
- **No real-time data:** Balances and other card data are point-in-time snapshots entered by the user; the app does not know about transactions made after the last update
- **Payment timing:** Recommendations assume the user can make payments on any day (no bank processing delays or hold periods are modeled)
- **Minimum payment accuracy:** User-entered minimum payments are assumed correct; the app does not calculate minimums from balance/APR

#### Technical Assumptions

- Device has sufficient storage for SQLite database (minimal, <10MB expected)
- App will primarily be used on iOS initially (Expo supports both, but testing focused on iOS)
- Users will update card balances at least once per billing cycle for recommendations to be useful

#### Scope Assumptions

- Interest calculations are for explanation/comparison only, not precise to the penny
- Utilization impact on credit score is directional ("lower is better") not predictive ("doing X will raise score by Y points")
- Grace periods are not modeled; the app does not distinguish between "pay statement balance to avoid interest" vs. "pay minimum to avoid late fee"

---

### Glossary

| Term                     | Definition                                                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cycle**                | The time window used for planning, defined as the period between a card's statement close dates. "This cycle" means the current open period before the next statement closes. Each card has its own cycle based on its statement close date.                  |
| **Utilization**          | Credit utilization ratio, calculated as `(balance / credit limit) × 100`. Expressed as a percentage. Lower is generally better for credit scores. The app tracks both per-card utilization and overall utilization (sum of all balances / sum of all limits). |
| **Statement Close Date** | The date when a card issuer closes the billing period and reports the balance to credit bureaus. Payments made before this date reduce the reported utilization; payments after do not affect that month's report.                                            |
| **Due Date**             | The date by which at least the minimum payment must be made to avoid late fees and potential penalty APR. Typically 21-25 days after statement close.                                                                                                         |
| **Minimum Payment**      | The smallest amount a user must pay by the due date to keep the account in good standing. Failure to pay results in late fees and negative credit reporting.                                                                                                  |
| **APR**                  | Annual Percentage Rate. The yearly interest rate charged on carried balances. Stored internally as basis points (e.g., 2199 = 21.99%) for precision.                                                                                                          |
| **Promo APR**            | A temporary reduced APR (often 0%) offered for a limited time on purchases or balance transfers. The app deprioritizes these cards for avalanche strategy until the promo expires.                                                                            |
| **Strategy**             | The method used to prioritize extra payments after minimums are covered. Three options: **Snowball** (smallest balance first), **Avalanche** (highest APR first), **Utilization** (highest utilization with approaching statement close first).               |
| **Snowball**             | Debt payoff strategy that prioritizes paying off the smallest balance first, regardless of APR. Provides psychological wins by eliminating cards from the list quickly.                                                                                       |
| **Avalanche**            | Debt payoff strategy that prioritizes paying the highest APR balance first. Mathematically optimal for minimizing total interest paid, but progress may feel slower.                                                                                          |
| **PlanSnapshot**         | The complete output of the solver for a given set of inputs. Contains: generated timestamp, strategy used, available cash, list of recommended actions, and summary statistics. Defined in `packages/schemas/src/plan.ts`.                                    |
| **PlanAction**           | A single recommended payment within a PlanSnapshot. Contains: card reference, amount, target date, action type (MINIMUM, EXTRA_PAYMENT, UTILIZATION_PAYMENT), human-readable reason, and priority ranking. Defined in `packages/schemas/src/action.ts`.       |
| **Provenance**           | The source of a data field. In POC, all data is user-entered ("Edited"). Future Plaid integration will add "From bank" provenance, with user edits overriding bank data and showing "Edited" badge.                                                           |
| **Elimination Callout**  | A UI highlight shown when a card can be fully paid off with available cash, or is close to payoff. Supports the psychological win aspect of snowball strategy. Example: "🎯 Pays off this card!"                                                              |
| **Needs Attention**      | Plan section containing cards that require action this cycle—either minimum payments due soon or extra payments recommended by the selected strategy.                                                                                                         |
| **On Track**             | Plan section containing cards with no immediate action required—zero balance, minimum already covered, or low priority based on current strategy.                                                                                                             |

---

### Acceptance Criteria (Key Flows)

#### Flow 1: Add Card

| Step                                   | Expected Behavior                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| User taps "+ Add Card" on Cards screen | Navigate to Add Card screen                                                       |
| User enters card name                  | Required field; cannot save without it                                            |
| User enters credit limit               | Required; must be > 0                                                             |
| User enters current balance            | Required; must be ≥ 0 and ≤ credit limit                                          |
| User enters minimum payment            | Required; must be ≥ 0 and ≤ balance                                               |
| User enters APR                        | Required; must be ≥ 0                                                             |
| User enters statement close date       | Required; day of month (1-31)                                                     |
| User enters due date                   | Required; day of month (1-31)                                                     |
| User taps "Add Card"                   | Card is saved to database, user navigates to Cards list, new card appears in list |
| User generates a plan                  | New card appears in plan recommendations                                          |

**Validation Rules:**

- Card name: 1-50 characters
- Issuer: 0-30 characters (optional)
- All currency fields: non-negative integers (cents)
- APR: 0.00% - 99.99%
- Dates: valid day of month (1-31)

---

#### Flow 2: Generate Plan

| Step                                      | Expected Behavior                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| User navigates to Plan screen             | Cash input shows last entered value (or $0 if first use)                                  |
| User enters available cash (e.g., $1,500) | Input accepts numeric value with currency formatting                                      |
| User selects strategy from dropdown       | Modal shows three options with explanations; selected strategy highlighted                |
| User taps "Generate Plan"                 | Solver executes in <100ms (not perceptible to user)                                       |
| Plan Summary appears                      | Shows total payments, required minimums, extra toward balances, card counts               |
| Needs Attention section appears           | Cards sorted by priority; each shows recommended actions with amounts, dates, and reasons |
| On Track section appears (collapsed)      | Cards with no action needed; expandable                                                   |
| User changes strategy                     | Plan regenerates instantly with new prioritization                                        |
| User changes available cash               | Plan regenerates with new allocation                                                      |

**Performance Criteria:**

- Plan generation: <100ms for up to 20 cards
- UI update: <16ms (60fps) after generation completes

**Edge Cases:**

- Available cash = $0: Show plan summary with $0 allocated; Needs Attention shows minimums still due
- Available cash < total minimums: Allocate in due-date order; show warning that not all minimums are covered
- No cards with balance: Show "All cards paid off!" empty state
- All cards excluded: Show "No cards to optimize" empty state

---

#### Flow 3: Edit Card (Override)

| Step                                             | Expected Behavior                                            |
| ------------------------------------------------ | ------------------------------------------------------------ |
| User taps a card on Cards list                   | Navigate to Edit Card screen                                 |
| User sees current values                         | All fields populated with saved data                         |
| User modifies APR (e.g., 21.99% → 19.99%)        | Field updates; no immediate save                             |
| User taps "Save Changes"                         | Card updates in database; "Last updated" timestamp refreshes |
| User returns to Plan screen                      | Plan reflects new APR in recommendations                     |
| _(Future: Plaid)_ User edits a "From bank" field | Provenance changes to "Edited"; badge visible on card        |

**Provenance Rules (Future):**

- "From bank": Data pulled from Plaid, not modified by user
- "Edited": User has modified this field (overrides bank data until next sync)
- No badge: Manually entered card (POC default)

---

#### Flow 4: Mark Payment as Paid

| Step                                       | Expected Behavior                                             |
| ------------------------------------------ | ------------------------------------------------------------- |
| User views Plan screen with generated plan | Action blocks show "✓ Mark paid" button                       |
| User taps "Mark paid" on an action         | Confirmation bottom sheet appears                             |
| Confirmation shows amount and card name    | "Mark $570 payment as paid?"                                  |
| User taps "Confirm"                        | Action marked as paid; card balance reduced by payment amount |
| Plan regenerates automatically             | Remaining cash (if any) reallocated; updated plan displayed   |
| Card's "Last updated" timestamp updates    | Reflects the mark-as-paid action                              |

**Edge Cases:**

- Payment amount > current balance: Reduce balance to $0 (overpayment not tracked)
- Multiple actions on same card: Each can be marked independently
- User cancels confirmation: No changes made

---

#### Flow 5: No Action Needed

| Step                                                                          | Expected Behavior                                                                            |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| User has cards but all balances are $0                                        | Plan screen shows: "🎉 All cards paid off! No payments needed this cycle."                   |
| User has cards but all minimums are far out (>14 days) and utilization is low | Needs Attention section is empty or shows minimal items; On Track section shows all cards    |
| User has cards but all are excluded from optimization                         | Plan screen shows: "No cards to optimize. Check your card settings."                         |
| User has no cards added                                                       | Plan screen shows: "Add your first card to start planning payments" with "+ Add Card" button |

**UI States:**

- Empty state illustrations are simple icons, not elaborate graphics
- Messages are calm and factual, not celebratory or guilt-inducing
- Call-to-action is always clear (add card, update balances, etc.)

---

#### Flow 6: Delete Card

| Step                                        | Expected Behavior                                  |
| ------------------------------------------- | -------------------------------------------------- |
| User taps "Delete Card" on Edit Card screen | Confirmation alert appears                         |
| Alert shows card name                       | "Delete Chase Sapphire Reserve?"                   |
| Alert shows warning                         | "This action cannot be undone."                    |
| User taps "Delete"                          | Card removed from database; navigate to Cards list |
| Cards list updates                          | Deleted card no longer appears                     |
| Plan regenerates on next view               | Deleted card not included                          |
| User taps "Cancel"                          | Alert dismissed; no changes                        |

---

#### Flow 7: Export Data

| Step                                | Expected Behavior                                |
| ----------------------------------- | ------------------------------------------------ |
| User taps "Export Data" in Settings | Export process begins                            |
| App generates JSON file             | Contains all cards and plan history              |
| Share sheet appears                 | User can save to Files, AirDrop, email, etc.     |
| Export completes                    | Toast confirmation: "Data exported successfully" |

**Export Format:**

```json
{
  "exportedAt": "2026-02-02T16:00:00Z",
  "version": "1.0.0",
  "cards": [...],
  "planHistory": [...]
}
```

---

### Out of Scope (POC)

Explicitly excluded from POC to prevent scope creep:

| Feature                            | Reason                                               | Future Phase         |
| ---------------------------------- | ---------------------------------------------------- | -------------------- |
| Plaid integration                  | Cost, complexity                                     | Phase 8              |
| Server/sync                        | Not needed for single-user local app                 | Phase 7              |
| User authentication                | No server = no auth needed                           | Phase 7              |
| Push notifications                 | Requires additional setup                            | Post-POC             |
| Widgets                            | Requires App Group plumbing                          | Post-POC             |
| Multi-user/household               | Complexity                                           | Future               |
| Interest calculations to the penny | Requires exact payment dates, daily balance tracking | Future               |
| Credit score predictions           | Legal/accuracy concerns                              | Never (out of scope) |
| Automatic payments                 | Out of product scope                                 | Never                |
| Budgeting features                 | Different product                                    | Never                |

---

### Technical Constraints / Scope

#### Platform

- **MVP Platform:** Mobile-first application built with Expo (iOS + Android), with optional web support limited to modern desktop browsers.
- **Primary Target:** iOS and Android smartphones.
- **Non-goals for MVP:**
  - Native desktop applications.
  - Background money movement or payment execution.
  - Deep OS integrations beyond notifications and (future) widgets.

#### Data & Persistence

- **MVP Data Model:**
  - User-entered financial data (balances, due dates, APRs, limits).
  - App-derived data (plans, snapshots, derived metrics).
- **Persistence:**
  - Supabase used for authenticated persistence and sync across devices.
  - No reliance on third-party financial data providers (e.g. Plaid) in MVP.
- **Source of Truth:**
  - User input is authoritative.
  - All derived values are recomputed deterministically from stored inputs.
- **Privacy Constraint:**
  - No raw bank credentials, transaction histories, or secrets stored.
  - AI features (future) operate on derived metrics only.

#### Data Authority

- User-entered values are authoritative.
- Derived values are recomputed, never edited directly.
- No inferred data may override explicit user input.

#### Browser / Device Support

- **Supported:**
  - iOS: current and previous major iOS versions.
  - Android: current and previous major Android versions.
  - Web (if enabled): modern evergreen browsers (Chrome, Safari, Firefox, Edge).
- **Unsupported / Out of Scope:**
  - Legacy browsers (IE, non-evergreen).
  - Tablet-optimized layouts in MVP (mobile-first only).

---

### Dependencies

#### Third-Party Services

- **Authentication:** Clerk
- **Database / Sync:** Supabase
- **AI (Future Versions):** OpenAI models, gated by AI Safety Spec
- **Explicitly Excluded from MVP:**
  - Plaid or any bank aggregation service
  - Credit bureau data
  - Automated payment execution services

#### Internal / Shared Packages

- **Solver / Planning Engine**
  - Deterministic, pure logic.
  - Lives in a shared package (e.g. `packages/solver`).
  - No UI, network, or side effects.
- **Shared Types & Schemas**
  - Zod + TypeScript schemas (e.g. `packages/shared`).
  - Single source of truth for:
    - Card metadata
    - Plan snapshots
    - AI boundaries
- **UI Layer**
  - Consumes solver outputs; does not re-implement logic.
  - No hidden business rules in UI components.

#### Design System

- **MVP:**
  - Lightweight, custom component set.
  - Emphasis on clarity, hierarchy, and explainability.
- **Non-goals:**
  - Large external design systems unless strictly justified.
  - Over-styling at the expense of readability.

---

### Definition of Done (MVP)

The MVP is considered complete when all of the following are true:

#### Functional Completeness

- All MVP features described in the PRD are implemented.
- Payment plans are generated deterministically from user inputs.
- Plans are cycle-specific and reference statement close vs. due date correctly.
- Manual overrides for due dates, statement close dates, APRs, and balances are supported.

#### Correctness & Safety

- Minimum payments are never missed in generated plans.
- Cash constraints are respected.
- Disclaimers are clearly visible wherever recommendations are shown.
- No claims of guaranteed credit score or credit limit outcomes.

#### Quality Bar

- No critical or blocking bugs in:
  - Core onboarding
  - Plan generation
  - "Why this plan" explanation flow
- TypeScript strict mode passes.
- All solver logic covered by unit tests for common and edge cases.

#### Transparency & Documentation

- Known limitations are explicitly documented, including but not limited to:
  - Assumes US-style credit card statement cycles.
  - Does not model issuer-specific or unpublished bank policies.
  - Does not account for pending transactions unless manually entered.
- README and PRD accurately reflect implemented behavior.

---
