## 1. Data Contracts And Report Logic

- [x] 1.1 Add Step 4 audience, report, task, opportunity, pilot, and safety types to the plan/domain model.
- [x] 1.2 Extend `ImplementPlanInput`, defaults, merge behavior, completion checks, and generated AI-Ready Action Plan output for the new Step 4 report data.
- [x] 1.3 Port/adapt reference app department, work-area, task-chip, and quick-role constants from `job-categories.ts` into local project modules.
- [x] 1.4 Port/adapt `RoleAnalysis`, `RoleTask`, AUTOMATE/AUGMENT/OWN bucket, frequency, confidence, and structured report schema concepts from the reference app.
- [x] 1.5 Add deterministic demo AI Opportunity Report data adapted from `ExecutiveAuditSection.tsx` and `audit-types.ts`.
- [x] 1.6 Add simplified cost-model helpers adapted from `cost-model.ts` for value, hours, FTE, and pain-category estimates.
- [x] 1.7 Add Maria-style employee demo/fallback data and avatar treatment adapted from `EmployeeAnalysisSection.tsx` and `maria-avatar.png` where appropriate.
- [x] 1.8 Add sample pilot task definitions adapted from `sample-tasks.ts`, including employee/business pitch, reviewer, confidence threshold, and hours-per-week fields.

## 2. Server Analysis Surfaces

- [x] 2.1 Create an Employee Task Transformation analysis API/server utility using `GEMINI_API_KEY`, the reference-style role-analysis prompt/schema, `gemini-2.5-flash` by default, and structured output validation.
- [x] 2.2 Create a Business Leader AI Opportunity audit API/server utility that supports live audit when Gemini, Firecrawl, and The Companies API keys are configured.
- [x] 2.3 Add Business Leader demo fallback behavior when live audit keys are missing, including an explicit demo-label flag in the response.
- [x] 2.4 Add error, retry, and malformed-response handling for both report paths, including no silent Employee fallback when Gemini is configured but fails.

## 3. Step 4 UI Replacement

- [x] 3.1 Replace the current `ImplementDemo` form with an audience-gated AI Implementation Lab component.
- [x] 3.2 Build the Business Leader path with company URL, email, submit action, loading checklist, AI Opportunity Report, first opportunity selection, and save action.
- [x] 3.3 Build the Employee path with work-area selection, task chips, optional custom tasks, submit action, loading checklist, Task Transformation Report, first pilot task selection, and save action.
- [x] 3.4 Add Start Over behavior that clears only Step 4 state and leaves other saved plan steps intact.
- [x] 3.5 Style report cards, KPI bands, bucket badges, task rows, tool chips, selected states, and spinning loading indicators using the existing portal design system.

## 4. Plan Persistence And Content

- [x] 4.1 Add local save behavior for selected audience, generated report, selected pilot, and guardrail/safety state.
- [x] 4.2 Update final `/plan` rendering so saved Step 4 output reads as the implementation portion of the AI-Ready Action Plan.
- [x] 4.3 Update visible Step 4 copy and MVP notes so demo reports, local persistence, and missing live audit keys are clear.
- [x] 4.4 Preserve EN/ES/PT framework navigation and fall back to English for report-specific generated content where needed.

## 5. Verification

- [x] 5.1 Run lint, typecheck, and production build.
- [x] 5.2 Browser-test `/implement` Business Leader path with missing audit keys and confirm the labeled demo AI Opportunity Report appears.
- [x] 5.3 Browser-test `/implement` Employee path through task selection, report generation or handled error, pilot selection, save, and `/plan` output.
- [x] 5.4 Verify responsive desktop/mobile layouts and console-error-free interaction for both audience paths.
