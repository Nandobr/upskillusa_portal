## Context

The current production branch now contains a richer Step 4 AI Implementation Lab with Business Leader and Employee paths. The Business Leader path still starts with company URL/email and produces an AI Opportunity Report, while the Employee path already uses the more useful guided-builder pattern: choose work area, select task chips, generate a report, select a first pilot, add guardrails, and save.

The next change should separate two different jobs-to-be-done:

- Step 4 `/implement`: personal AI readiness and first-pilot planning for both leaders and workers.
- New `/opportunity`: company-level URL audit and organizational opportunity report.

The reference app supports this separation: its top navigation uses `Opportunity` as the company-audit entry, while the role/task analysis flow produces personal task transformation outputs.

## Goals / Non-Goals

**Goals:**

- Remove company URL/email intake from the Step 4 Business Leader path.
- Make Business Leader follow the same guided pattern as Employee: audience, work area, task/responsibility chips, report, first pilot, guardrails, save.
- Rename/shape the Business Leader report as `Personal AI Readiness Report`.
- Keep the Employee report as `Task Transformation Report`.
- Preserve all current Step 4 report strengths: KPI band, AUTOMATE/AUGMENT/OWN buckets, task-by-task cards, recommended AI tools, daily workflow CTA, Start Over, and save-to-plan.
- Add a public `/opportunity` page for company URL audit.
- Add an `Opportunity` top-navigation link using the existing header design system.
- Reuse/adapt the current business audit endpoint and reference-app audit flow for `/opportunity`.
- Keep local demo fallback behavior when live audit keys are not configured.

**Non-Goals:**

- No Supabase storage, authentication, admin dashboard, or lead database.
- No email delivery requirement.
- No Emulation Station workflow canvas.
- No change to Step 1, Step 2, or Step 3 journeys beyond navigation copy/layout needed for the new `Opportunity` link.
- No removal of the existing feature-branch Step 4 employee report logic.
- No hidden display or logging of environment variable values.

## Decisions

### Treat Step 4 as personal readiness only

Step 4 should generate personal reports for both audiences. Business Leaders will not enter a company URL there; instead they select their own work area and responsibilities.

- Rationale: a leader can get immediate value by seeing how their own decision workflows and responsibilities can be automated, augmented, or kept human-owned.
- Alternative considered: keep URL audit as the first Business Leader step. That duplicates the new Opportunity page and makes Step 4 less personal.

### Use one shared guided-builder implementation for both Step 4 audiences

The Step 4 form should reuse the same work-area options, task chips, optional custom tasks, report generation, pilot selection, and guardrail-save flow for Business Leader and Employee. The difference is report title/copy, not the interaction model.

- Rationale: this reduces complexity and mirrors the successful Employee journey.
- Alternative considered: create a separate leader-only questionnaire. That would add more copy and validation while producing similar report data.

### Keep leaders able to choose any work area

Business Leaders should not be forced into `Executive Leadership`; they can choose any work area first.

- Rationale: owners/leaders may be deeply involved in finance, operations, sales, or HR depending on company size.
- Alternative considered: default to Executive Leadership. That is useful as a preselect later, but it is too narrow for the MVP.

### Render Business Leader output as a personal report

The Business Leader path should call the output `Personal AI Readiness Report`. It can reuse the underlying employee/task report schema where useful, but UI labels should shift from "daily tasks" to "responsibilities", "leadership work", or "decision workflows" where appropriate.

- Rationale: this keeps implementation efficient while making the output feel leader-specific.
- Alternative considered: create a separate report schema immediately. That may be needed later, but the current classification and tool-suggestion model already fits.

### Move company audit to `/opportunity`

The new Opportunity page should be the only place where company URL/email audit appears. It should use the reference app's audit flow: URL input, email step, loading checklist, report card, print/save PDF, and demo fallback.

- Rationale: `Opportunity` is the reference app's top-level business value entry, and separating it makes the portal easier to understand.
- Alternative considered: place the audit under `/implement/opportunity`. A top-level nav item is clearer and matches the requested reference.

### Reuse the existing audit endpoint with page-level isolation

Keep or adapt `/api/analyze-business-opportunity` for the new page, but do not call it from Step 4 after this change. Step 4 should use the task/personal-readiness report endpoint for both audiences.

- Rationale: avoids duplicating server logic while cleanly separating user journeys.
- Alternative considered: create a new endpoint name immediately. That may be cleaner later, but route churn is not necessary for MVP.

### Navigation placement

Add `Opportunity` to the top navigation as a first-class link. It should appear before the four framework steps on desktop and mobile, while preserving the existing Inspire, Learn, Seminar, Implement sequence.

- Rationale: the audit is a gateway into organizational value, not one of the four framework steps.
- Alternative considered: replace Watch Demo with Opportunity. That would reduce access to the demo and make the action less obvious on mobile.

## Risks / Trade-offs

- Business Leader personal report may feel too similar to Employee report -> Use report title and copy variants to make it clear the leader is reviewing responsibilities and decision workflows.
- Existing saved Step 4 drafts may contain `companyUrl`, `email`, and business audit reports -> Preserve backward-compatible fields but do not require them for Step 4 completion.
- The new Opportunity page may duplicate code from the old Business Leader Step 4 view -> Extract small reusable report helpers where it reduces duplication, but avoid broad refactors.
- Vercel production may deploy only `main` -> Ensure implementation lands on `main` or a merged PR before validating production.
- Live audit keys may be unavailable -> Keep labeled demo fallback and avoid implying verified scanning when fallback is used.
- Adding another nav item may crowd mobile header -> Verify desktop and mobile nav width, especially at 360px and 390px.

## Migration Plan

1. Update Step 4 to remove URL/email from the Business Leader branch and route both audiences through work-area/task selection.
2. Add leader-specific report title and copy while reusing the existing report data model where practical.
3. Add `/opportunity` page and move the current company audit flow/report view there.
4. Add `Opportunity` to desktop and mobile navigation.
5. Update plan output so Step 4 saved Business Leader reports read as personal readiness, not company audit.
6. Keep older local drafts from crashing by tolerating existing `companyUrl`, `email`, and business report fields.
7. Run lint, typecheck, build, and browser checks for `/implement`, `/opportunity`, and mobile navigation.

Rollback: revert the change commit to restore the current Step 4 business audit path and remove the Opportunity page/nav link.

## Open Questions

- None for MVP scope. The agreed defaults are: report title `Personal AI Readiness Report`, nav label `Opportunity`, and leaders may choose any work area first.
