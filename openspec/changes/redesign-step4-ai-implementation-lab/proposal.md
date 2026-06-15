## Why

Step 4 currently presents a simple mock implementation form, but the next MVP needs to demonstrate concrete AI value opportunities for both business leaders and employees. The reference app provides the right process: route each audience into a focused report that shows opportunity, task transformation, and a first pilot.

## What Changes

- Replace the current Step 4 form with an AI Implementation Lab guided by an audience choice.
- Add a Business Leader path that accepts a company URL and email, attempts a live AI Opportunity Report when audit keys are configured, and otherwise displays a clearly labeled demo report inspired by the reference app.
- Add an Employee path that asks for work area, task-chip selections, optional custom tasks, and generates a Task Transformation Report using the existing Gemini key.
- Add report views for opportunity value, hours saved, FTE equivalent, AUTOMATE / AUGMENT / OWN task buckets, suggested tools, and first pilot options.
- Port/adapt the reference app's key report data assets: executive demo report sample, Maria-style employee demo data/avatar pattern, sample pilot tasks, and simplified cost-model assumptions.
- End both paths with a first pilot selection and save action into the local AI-Ready Action Plan.
- Keep the portal's existing Step 2 / Step 3 UI language and design system instead of cloning the reference app's landing page shell.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Replace the Implement mock audit and workflow demo with an audience-gated AI Implementation Lab containing Business Leader and Employee report journeys.

## Impact

- Affected routes/components: `/implement`, `src/components/portal-pages.tsx`, shared plan draft state, generated plan output.
- New server/API surface: Step 4 analysis endpoints or equivalent server utilities for Business Leader and Employee reports.
- Data model: extend `ImplementPlanInput` to persist selected audience, generated report data, selected pilot, custom tasks, email, URL, and safety/guardrail choices.
- Reference assets: adapt report schemas and sample data from `audit-types.ts`, `cost-model.ts`, `job-categories.ts`, `sample-tasks.ts`, `ExecutiveAuditSection.tsx`, `EmployeeAnalysisSection.tsx`, and `maria-avatar.png` where useful.
- Environment: use `GEMINI_API_KEY` for Employee reports; support `OPENAI_API_KEY` and `FIRECRAWL_API_KEY` for live Business Leader audits when later configured.
- Verification: lint, typecheck, production build, and browser checks for both Step 4 audience paths.
