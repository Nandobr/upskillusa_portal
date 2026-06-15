## Why

Step 4 currently mixes personal implementation planning with a company URL audit, which makes the Business Leader journey feel less like a personal readiness builder and makes production deployment depend on company-audit behavior. The next MVP should separate those jobs: Step 4 helps leaders and workers understand their own AI readiness, while a top-level Opportunity page runs the company-level audit.

## What Changes

- Change the Step 4 Business Leader journey from company URL intake to a guided personal readiness path that mirrors the Employee journey.
- Let Business Leaders choose any work area first, then select responsibilities/tasks, generate a `Personal AI Readiness Report`, choose a first pilot, add guardrails, and save to the local AI-Ready Action Plan.
- Keep the Employee path as a `Task Transformation Report` journey using the same work-area, task-chip, custom-task, report, first-pilot, and guardrail pattern.
- Move company URL audit functionality out of `/implement` into a new public `/opportunity` route.
- Add `Opportunity` to the top navigation, matching the reference app's top-level audit entry point naming.
- Adapt the reference app's URL-audit feature for the new Opportunity page: company URL input, email step, loading checklist, company opportunity/audit report, print/save affordance, and labeled demo fallback when live keys are missing.
- Update Step 4 copy and saved plan output so leader-facing language uses personal readiness, responsibilities, leadership work, and decision workflows instead of company URL scanning.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Split Step 4 personal readiness from company-level URL audit by changing `/implement` behavior and adding `/opportunity` as a first-class public route/nav item.

## Impact

- Affected routes/components: `/implement`, new `/opportunity`, app shell navigation, `src/components/portal-pages.tsx`, shared report components/utilities, and local AI-Ready Action Plan output.
- API surface: move/reuse the existing business opportunity audit endpoint for the new Opportunity page; Step 4 should no longer require company URL/email for the Business Leader path.
- Data model: adjust `ImplementPlanInput` semantics so Business Leader saved reports can be personal readiness reports, while company audit inputs/results are isolated from Step 4 plan completion.
- Content: update EN/ES/PT Step 4 notes and navigation copy so `Opportunity` is the company audit entry and Step 4 is personal pilot readiness.
- Environment: continue supporting demo fallback when `OPENAI_API_KEY` and `FIRECRAWL_API_KEY` are unavailable; do not expose secrets.
- Verification: lint, typecheck, production build, and browser checks for Step 4 leader/employee paths plus the new Opportunity page on desktop and mobile.
