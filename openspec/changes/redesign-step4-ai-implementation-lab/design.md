## Context

The portal already has a four-step public journey and a local AI-Ready Action Plan store. Step 4 currently uses a small mock implementation form. The reference app demonstrates richer value discovery through two useful patterns: a Business Leader AI opportunity audit and an Employee task transformation analysis.

The MVP target is not a full clone of the reference app. Step 4 should borrow the reference app's features, logic, process, and user experience while keeping this portal's Step 2 / Step 3 guided-builder style and design system. Business leaders need to see measurable value opportunities. Employees need to see how daily tasks can be upgraded while preserving human ownership.

## Goals / Non-Goals

**Goals:**

- Replace the current `/implement` form with an audience-gated AI Implementation Lab.
- Start with a simple choice: Business Leader or Employee.
- Provide a Business Leader path with URL and email intake, loading state, AI Opportunity Report, opportunity/pilot selection, and save-to-plan.
- Provide an Employee path with work-area selection, task chips, optional custom tasks, loading state, Task Transformation Report, pilot task selection, and save-to-plan.
- Reuse reference app logic for AUTOMATE / AUGMENT / OWN task classification, time-savings estimates, FTE equivalent, suggested tools, and task-by-task breakdown.
- Port or adapt the reference app's key data assets: executive audit sample, Maria-style employee demo sample and avatar pattern, sample pilot task definitions, department/task-chip data, report schemas, and simplified cost-model assumptions.
- Use `GEMINI_API_KEY` for the Employee report in the first implementation.
- Support future live Business Leader audits with `OPENAI_API_KEY` and `FIRECRAWL_API_KEY`, while showing a labeled demo report when those keys are missing.
- Persist generated report data and selected pilot into the local AI-Ready Action Plan.

**Non-Goals:**

- No full landing-page clone from the reference app.
- No Supabase lead storage, authentication, admin dashboards, or database migration.
- No email delivery in this change.
- No full Emulation Station workflow canvas or simulator.
- No requirement that prior Step 3 data exists before using Step 4.
- No hidden use or display of secret environment values.

## Decisions

### Use an audience gate as the first Step 4 interaction

Step 4 begins by asking whether the visitor is exploring AI for a business or for their own work.

- Rationale: the two primary MVP audiences need different proof. Leaders need business opportunity and value; employees need task ownership clarity.
- Alternative considered: one generic workflow builder. That would be simpler but would blur the distinct jobs-to-be-done.

### Make all Step pages independent

Step 4 will not require saved Step 3 data. It may save into the same AI-Ready Action Plan, but it starts from its own inputs.

- Rationale: the user explicitly wants step pages to be independent, and the reference app's value analysis works as a standalone journey.
- Alternative considered: prefill from Step 3 seminar output. That can be a later convenience, but it should not gate the Step 4 MVP.

### Implement Business Leader as URL audit UX with demo fallback

The Business Leader path keeps the reference flow of company URL plus email, loading checklist, and AI Opportunity Report. If live audit keys are unavailable, the app shows a clearly labeled demo report inspired by the reference app.

- Rationale: this allows the full product journey to be visualized now without blocking on OpenAI/Firecrawl keys.
- Alternative considered: use Gemini-only URL estimation immediately. That would produce live output with the current key, but it would drift from the reference app's audit architecture and make later replacement less clean.

### Implement Employee as Gemini task analysis

The Employee path uses work-area selection, reference-style task chips, optional custom tasks, and a Gemini-backed structured report.

- Rationale: `GEMINI_API_KEY` is already configured, and the reference app's onboarding analysis maps cleanly to this portal's Step 4 value demonstration.
- Alternative considered: show only a static demo employee report. That would be faster but less useful and less convincing.

### Store report data in the existing local plan draft

Extend `ImplementPlanInput` instead of introducing a separate storage key. The saved plan should include selected audience, report summary, selected pilot, and safety/guardrail state.

- Rationale: keeps the plan route coherent and avoids adding backend persistence.
- Alternative considered: mirror the reference app's separate onboarding localStorage key. That would isolate Step 4 state but make the final AI-Ready Action Plan harder to generate.

### Keep UI aligned to the portal design system

Use the existing navy/gold/white palette, Step 2/Step 3 guided cards, compact report panels, and accessible select-button patterns. Use reference app report composition only where it improves clarity: KPI band, bucket counts, task rows, loading checklist, and tool chips.

- Rationale: the user wants the other app's process, not its whole visual shell.
- Alternative considered: import Tailwind/shadcn styles from the reference repo. That would increase dependencies and clash with `DESIGN.md`.

### Port reference data assets intentionally

Use the reference app as the data source for report shape and credible demo content:

- `job-categories.ts`: department/work-area labels, top skills, task-chip inventory, and quick-role patterns.
- `assessment-types.ts` and `assessment.functions.ts`: `RoleAnalysis`, `RoleTask`, AUTOMATE/AUGMENT/OWN buckets, confidence/frequency fields, and structured schema.
- `ExecutiveAuditSection.tsx` and `audit-types.ts`: sample AI Opportunity Report shape, executive summary fields, pain categories, and score/value presentation.
- `cost-model.ts`: simplified deterministic assumptions for employees, addressable roles, weekly/annual hours, FTE equivalent, and value-at-risk style estimates.
- `EmployeeAnalysisSection.tsx`: Maria-style employee demo structure for worker-facing explanation and before/after task rows.
- `sample-tasks.ts`: first-pilot task definitions, employee/business pitch framing, confidence thresholds, reviewer, and hours-per-week estimates.
- `maria-avatar.png`: use only if it fits this portal's asset policy and visual direction; otherwise use a neutral local avatar treatment.

Adapt names, labels, and figures to the UpSkill USA portal context rather than copying the full reference page sections.

- Rationale: implementation should not miss the reusable data that makes the reports feel concrete.
- Alternative considered: rebuild all data from scratch. That would be cleaner legally/visually but slower and less faithful to the reference product logic.

## Risks / Trade-offs

- Business Leader demo fallback could be mistaken for a live scan -> Label the report as demo content when audit keys are missing and avoid claims of verified company scanning.
- Live audit integration may require more keys later -> Isolate Business Leader audit logic behind a server function/API route so OpenAI/Firecrawl can replace the demo generator without changing the page flow.
- AI-generated employee analysis may return malformed data -> Validate/coerce report shape server-side and show retry/error state if structured output is invalid.
- Adding optional custom tasks can make the UI heavier -> Keep custom task entry secondary to chips and limit task counts.
- Extending `ImplementPlanInput` can affect plan completion logic -> Update defaults and completion checks so Step 4 completes only after a report and pilot are saved.
- Email intake without email delivery may feel misleading -> Phrase email as "report contact" and store locally only; do not promise delivery until email service is added.
- Reference sample assets may overfit to Finance/AP examples -> Treat them as demo/fallback content and ensure generated Employee reports use the visitor's selected work area and task chips.
