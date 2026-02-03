# Codex Context — Credit Card Payment Planner

## Document Metadata

- Title: Context README
- Status: Active
- Owner: TBD
- Last updated: 2026-02-02

This directory contains the authoritative context for all Codex work on this repo.

## Order of Authority

1. DECISIONS.md (architectural and product decisions)
2. PLANS.md (execution phases, constraints, acceptance criteria)
3. PRD.md (product intent and scope)
4. UI_SPEC.md (UI specification)
5. AI-SAFETY.md (hard rules for AI features)
6. AI-EVALUATION.md (golden tests)

If any conflict exists, follow the higher-priority document.

## Repository Structure

- docs/context/PRD.md — product intent and user-facing requirements
- docs/context/PLANS.md — execution phases and engineering constraints
- docs/ — supporting design, AI governance, and evaluation
- packages/ — shared logic (solver, schemas)
- apps/ — web/mobile apps, api

## Non-negotiables

- Solver logic must remain deterministic.
- AI may propose, but solver must verify.
- No Plaid dependency in MVP.
- No guarantee language.
- Manual overrides always win.

## How to work

- Read this directory before making changes.
- Do not proceed beyond the current PLANS.md phase.
- Update PLANS.md before any multi-file change.
- Run tests and typechecks after changes.

If required information is missing, ask before guessing.
