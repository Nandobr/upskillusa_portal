## Why

Step 4 report generation already produces the right core data, but the rendered reports do not yet match the reference app's visual quality. Employees especially need a compact, personal, Maria-style AI-Ready Action Plan instead of a tall spreadsheet-like report, while business leaders need a premium executive audit card.

## What Changes

- Redesign the Employee report shell to match the reference app's compact personal report style: light metric cards, tight task rows, recommended tools/upskilling rows, and a smaller dark workflow CTA.
- Redesign the Business Leader report shell to match the reference app's executive audit style: premium white card, navy cost/value band, gold competitive-gap band, score/summary section, and compact opportunity rows.
- Keep existing Step 4 inputs, API calls, fallback data, selected-pilot behavior, guardrails, and save-to-plan logic unchanged.
- Add visible copy/download/print report actions where practical without adding persistence or backend changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Step 4 report views render generated Business Leader and Employee reports using the reference app's report composition and visual hierarchy.

## Impact

- Affected files: `src/components/portal-pages.tsx`, `src/app/globals.css`, and OpenSpec artifacts.
- No API, Supabase, Firecrawl, Gemini, or OpenAI behavior changes.
- Verification: OpenSpec validation, lint, typecheck, build, and browser checks only after user approval.
