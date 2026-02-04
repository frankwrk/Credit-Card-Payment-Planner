# UI Spec - Cycl (Credit Card Payment Planner)

## Document Metadata

- Title: UI Specification
- Status: Draft
- Owner: TBD
- Last updated: 2026-02-03

**Scope**
This spec documents the current UI as implemented in the codebase. It reflects the existing screens, components, copy, and interaction patterns derived from the React components in `apps/web/src/`.

**App Overview**

1. Mobile-first single-page app with a fixed bottom navigation and centered content constrained to `max-w-md` (28rem).
2. Screens: Plan (Home), Cards, Card Detail, Add Card, Explanation, Settings.
3. Strategy comparison modal is a bottom sheet on mobile and centered modal on larger widths.
4. Theme switching via a light/dark mode toggle stored in localStorage (`apex-theme`).

**Navigation & Flow**

1. Bottom tab bar with three tabs: Plan, Cards, Settings. Active tab determines the main screen.
2. Plan tab routes to Home screen.
3. Cards tab routes to Cards list screen.
4. Settings tab routes to Settings screen.
5. Card tap from Plan or Cards opens Card Detail screen.
6. Add Card button in Cards screen opens Add Card screen.
7. "Why this plan?" link on Plan opens Explanation screen.
8. Strategy modal can be opened from Plan (strategy selector) or Explanation (compare strategies).

**Design System**

Project: Cycl - Mobile Credit Card Payment Planner
Philosophy: "Quiet Control Panel"
Aesthetic: Monochromatic Carbon Black, Trustworthy, Ungamified

## 1. Color Palette

The application uses a strict monochromatic palette to reduce visual noise and financial anxiety.

### Core Colors

| Token            | Light Mode Value | Dark Mode Value | Usage                                             |
| ---------------- | ---------------- | --------------- | ------------------------------------------------- |
| `bg-background`  | `#F5F5F5`        | `#1C1C1C`       | Main application background (screens)             |
| `bg-card`        | `#FFFFFF`        | `#252525`       | Cards, Modals, Input backgrounds                  |
| `text-primary`   | `#1C1C1C`        | `#E4E4E4`       | Primary headings, values, button text (dark mode) |
| `text-secondary` | `#6B6B6B`        | `#9B9B9B`       | Subtitles, helper text, icons                     |
| `text-tertiary`  | `#3F3F3F`        | `#BEBEBE`       | Labels, table headers, secondary button text      |
| `border-default` | `#E4E4E4`        | `#3F3F3F`       | Card borders, dividers                            |
| `border-input`   | `#BEBEBE`        | `#3F3F3F`       | Input field borders                               |

### Interactive Elements

| Element            | Light Mode                         | Dark Mode                          | Notes                                       |
| ------------------ | ---------------------------------- | ---------------------------------- | ------------------------------------------- |
| **Primary Button** | Bg: `#1C1C1C`<br>Text: `#FFFFFF`   | Bg: `#E4E4E4`<br>Text: `#1C1C1C`   | Hover: Lighten/Darken slightly              |
| **Inputs**         | Bg: `#FFFFFF`<br>Border: `#BEBEBE` | Bg: `#252525`<br>Border: `#3F3F3F` | Focus Ring: `#6B6B6B`                       |
| **Icon Buttons**   | Bg: Transparent                    | Bg: Transparent                    | Hover: `#F5F5F5` (Light) / `#2C2C2C` (Dark) |

---

## 2. Typography

Font Stack: System Sans-Serif (Tailwind default)

| Role               | Size Class  | Approx. Size | Weight          | Usage                                                           |
| ------------------ | ----------- | ------------ | --------------- | --------------------------------------------------------------- |
| **Page Title**     | `text-2xl`  | 1.5rem       | `font-medium`   | "This Cycle"                                                    |
| **Screen Title**   | `text-lg`   | 1.125rem     | `font-medium`   | "Add Card", Modal Titles                                        |
| **Major Value**    | `text-xl`   | 1.25rem      | `font-medium`   | Total Payment amounts                                           |
| **Body / Input**   | `text-base` | 1rem         | `font-normal`   | Input text, standard copy                                       |
| **Labels**         | `text-sm`   | 0.875rem     | `font-medium`   | Form labels, card details                                       |
| **Subtext**        | `text-sm`   | 0.875rem     | `font-normal`   | Helper text                                                     |
| **Section Header** | `text-xs`   | 0.75rem      | `font-semibold` | "PLAN SUMMARY", "NEEDS ATTENTION" (Uppercase, `tracking-wider`) |

---

## 3. Spacing & Layout

The design assumes a mobile-first approach but is constrained for readability on larger screens.

**Max Width:** `max-w-md` (approx. 28rem / 448px) centered with `mx-auto`.
**Screen Padding:** `px-4` (horizontal), `py-6` (vertical top).
**Card Padding:** `p-4` generally, or `px-4 py-6` for detailed forms.
**Vertical Rhythm:** `space-y-4`: Between form groups or card lists. `mb-6`: Between major sections. `gap-3` or `gap-4`: Grid/Flex spacing.
**Border Radius:** `rounded-lg` (0.5rem): Inputs, Buttons, Standard Cards. `rounded-xl` (0.75rem): Larger container cards (if distinct from standard).
**Touch Targets:** Inputs/Buttons: `py-2.5` or `py-3` to ensure min-height ~44px.

---

## 4. Component Styles

### Cards & Containers

- **Style:** Flat with border, no elevation/shadow by default to maintain "quiet" look.
- **Class:** `bg-white dark:bg-[#252525] border border-[#E4E4E4] dark:border-[#3F3F3F] rounded-lg`

### Input Fields

- **Style:** Minimalist with clear borders.
- **Normal:** `border border-[#BEBEBE] dark:border-[#3F3F3F] rounded-lg bg-white dark:bg-[#252525]`
- **Focus:** `focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent`
- **Currency/Unit:** Use absolute positioned icons/text inside the input wrapper (`text-[#9B9B9B]`).

### Section Headers

- **Style:** Subtle, uppercase, high tracking.
- **Class:** `text-xs font-semibold tracking-wider text-[#6B6B6B] dark:text-[#9B9B9B] mb-3`

### Navigation/Header

- **Style:** Sticky top, simple border bottom.
- **Class:** `sticky top-0 bg-white dark:bg-[#252525] border-b border-[#E4E4E4] dark:border-[#3F3F3F] px-4 py-4`

---

## 5. Iconography

- **Library:** Lucide React
- **Stroke Width:** Default (2px) or slightly thinner if needed for elegance.
- **Color:** Matches text color (Primary or Secondary).
- **Common Icons:** `ChevronLeft`, `ChevronDown`, `Info`, `HelpCircle`, `CreditCard`.

## 6. CSS / Tailwind Configuration Notes

- **Dark Mode:** Implemented via `.dark` class strategy (manually toggled or system preference).
- **Animation:** Minimal. Simple transitions for hover states (`transition-colors`) and collapsible sections.

**Typography**

1. System sans-serif font stack (Tailwind default). No custom font specified.
2. Headings: `text-2xl` for main titles, `text-lg` for sticky header titles, `text-sm`/`text-xs` for labels and metadata.
3. Emphasis via `font-medium` and `font-semibold` for key numbers and titles.

**Color & Theme**

1. Light base: background `#F5F5F5` for list screens, white for cards and form surfaces.
2. Dark base: background `#1C1C1C` with surfaces `#252525` and borders `#3F3F3F`.
3. Text colors: primary `#1C1C1C` (light) and `#E4E4E4` (dark); muted `#6B6B6B` and `#9B9B9B`.
4. Accent usage: purple for strategy emphasis and "Mark paid" links; amber/yellow for warnings and disclaimers; red/orange/yellow/green for utilization thresholds.
5. Hover states and transitions use subtle color shifts and `transition-colors`.

**Data Model (UI-facing)**

1. `CreditCard`: id, name, issuer, balance, creditLimit, minimumPayment, apr, dueDate, statementCloseDate, currentUtilization, projectedUtilization, paymentBeforeStatement?, paymentByDueDate, excludeFromOptimization, editedFields.
2. `PaymentRecommendation`: amount, date, explanation.
3. Mock data is in `src/data/mockCards.ts` and drives initial UI values.

**Components**

**Bottom Navigation (`BottomNav`)**

1. Fixed bar anchored to bottom with three tabs: Plan, Cards, Settings.
2. Active tab uses darker text and heavier icon stroke.
3. Includes `safe-area-bottom` class for device insets (no explicit CSS definition found).

**Card Row (`CardRow`)**

1. Clickable card summary for Plan screen sections.
2. Shows card name, issuer, balance/limit, edited status pill.
3. Includes `UtilizationBar` and one or two `PaymentRecommendation` blocks.
4. Optional elimination callout with yellow highlight when balance is near payoff.

**Card List Item (`CardListItem`)**

1. Clickable list item for Cards screen.
2. Shows name, issuer, balance/limit, utilization percent, and a thin utilization bar.
3. Shows an "Excluded" pill if `excludeFromOptimization` is true.
4. Displays a mock "Updated X days ago" string.

**Utilization Bar (`UtilizationBar`)**

1. Label row with utilization percentages, and a dual-bar display when current and projected differ by more than 1%.
2. Color thresholds: >= 50% red, >= 30% amber, < 30% gray.

**Payment Recommendation (`PaymentRecommendation`)**

1. Shows payment label, amount, due date, and explanation text.
2. Optional "Estimated" tag and "Mark paid" action.
3. "Mark paid" currently logs to console and stops event propagation.

**Strategy Modal (`StrategyModal`)**

1. Full-screen dimmed overlay with bottom sheet layout on mobile.
2. Header with title "Compare Strategies" and close icon.
3. Strategy cards with title, description, "Best for," and "Trade-off."
4. Selected strategy uses purple emphasis and "Selected" pill.

**Screens**

**Plan Screen (`HomeScreen`)**

1. Header: "This Cycle," with subtitle and "Why this plan?" link.
2. Plan Controls card includes: Available Cash input with currency prefix, Strategy selector button with help icon and chevron, and primary action button "Generate Plan."
3. Plan Summary card includes: total payments, required minimums, extra toward balances, cards count, and cards needing attention.
4. Needs Attention list shows cards where utilization > 30% or balance > 10x minimum payment and is always expanded.
5. On Track list is collapsible with a chevron indicator and renders only when expanded.

**Cards Screen (`CardsScreen`)**

1. Header: "Cards."
2. Summary card shows total balance, total credit limit, overall utilization percentage with color-coded label, and a utilization progress bar.
3. Card list uses `CardListItem` for each card.
4. Add Card button with plus icon.

**Card Detail Screen (`CardDetailScreen`)**

1. Sticky header with back button and title "Edit Card."
2. Summary block with balance and utilization.
3. Editable fields include APR, Credit Limit, Current Balance, Minimum Payment, Statement Closing Date, and Payment Due Date. Fields modified from bank values show "Edited" and include a reset icon.
4. Exclude from optimization checkbox.
5. Advanced section (collapsible) includes Promotional APR and Promo Expiration Date.
6. "Last updated: Jan 28, 2026" static text.
7. Save Changes button.
8. Delete Card button with confirmation dialog (console-only delete).

**Add Card Screen (`AddCardScreen`)**

1. Sticky header with back button and title "Add Card."
2. Sections include Card Information, Financial Details, Important Dates, and Advanced (collapsible).
3. Inputs cover name, issuer, credit limit, balance, minimum payment, APR, statement close date, due date, promo APR, and promo expiration.
4. Save button labeled "Add Card."
5. On save, a new card is computed and pushed into state with derived utilization.

**Explanation Screen (`ExplanationScreen`)**

1. Sticky header with back button and title "Why This Plan?"
2. Strategy section with purple emphasis and a "Compare strategies ->" action.
3. Informational sections with copy explaining strategy logic.
4. Disclaimer section highlighted in amber.
5. "What this plan doesn't do" list.

**Settings Screen (`SettingsScreen`)**

1. Header: "Settings."
2. Appearance card toggles theme (light/dark) with sun/moon icon.
3. Data card includes "Refresh Data" and "Export Data" actions.
4. Support card includes "Send Feedback" and "Legal & Privacy" actions.
5. App info shows an app name label and version 1.0.0 (label is currently hardcoded in UI).

**Interactive States & Behavior**

1. Buttons and list items have hover background changes and `transition-colors`.
2. Forms use standard focus ring `focus:ring-2 focus:ring-[#6B6B6B]`.
3. Placeholder actions: Generate Plan logs to console, Mark Paid logs to console, Delete Card logs to console after confirmation, Refresh Data has no action, Export Data generates a JSON file with empty cards and current theme.

**Accessibility Notes**

1. Labels are present for all inputs.
2. Buttons use readable text and icons from `lucide-react`.
3. No explicit aria attributes besides `aria-label` on reset buttons.

**Open Questions / Clarifications Needed**

1. None. This spec is scoped to components wired into `App.tsx`, avoids brand naming, and keeps color documentation at a semantic grouping level.
