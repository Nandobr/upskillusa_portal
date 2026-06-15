## 1. Step 4 Personal Readiness Journey

- [x] 1.1 Update Step 4 audience copy so Business Leader describes a personal AI readiness journey, not company URL audit.
- [x] 1.2 Remove company URL and email inputs from the Step 4 Business Leader path.
- [x] 1.3 Route both Business Leader and Employee through the shared work-area selector.
- [x] 1.4 Let Business Leaders choose any existing work area before selecting responsibilities/tasks.
- [x] 1.5 Reuse task-chip selection, custom task entry, selected count, and generate-report behavior for both audiences.
- [x] 1.6 Add leader-specific report title and copy so Business Leader output reads `Personal AI Readiness Report`.
- [x] 1.7 Keep Employee output titled `Task Transformation Report`.
- [x] 1.8 Ensure Step 4 Start Over clears only Step 4 state for both audiences.

## 2. Report Generation And Saved Plan

- [x] 2.1 Adjust report generation payloads so Business Leader personal reports use work area and selected responsibilities/tasks instead of URL/email.
- [x] 2.2 Preserve report metrics: readiness band, monthly hours saved, FTE equivalent, automation potential, and AUTOMATE/AUGMENT/OWN buckets.
- [x] 2.3 Preserve task/responsibility cards, recommended AI tools, and daily AI workflow CTA for both audiences.
- [x] 2.4 Update first-pilot selection so Business Leader and Employee reports both open the guardrails/save step.
- [x] 2.5 Update local AI-Ready Action Plan output so saved Business Leader Step 4 data is described as a personal readiness report.
- [x] 2.6 Keep backward compatibility for existing local drafts that still contain company URL/email or older business report data.

## 3. Opportunity Page

- [x] 3.1 Add a public `/opportunity` route.
- [x] 3.2 Move/adapt the current company URL audit flow into the Opportunity page.
- [x] 3.3 Implement Opportunity URL input, email step, loading checklist, report view, print/save affordance, and restart/change-company action.
- [x] 3.4 Reuse the existing business opportunity audit API route or shared utilities from the current Step 4 Business Leader flow.
- [x] 3.5 Keep a clearly labeled demo company opportunity report when live audit keys are missing or the live audit fails.
- [x] 3.6 Ensure Opportunity page state does not alter saved Step 4 personal readiness data.

## 4. Navigation And Content

- [x] 4.1 Add `Opportunity` to desktop top navigation before the four framework steps.
- [x] 4.2 Add `Opportunity` to mobile navigation.
- [x] 4.3 Preserve the framework sequence Inspire, Learn, Seminar, Implement.
- [x] 4.4 Update EN/ES/PT Step 4 demo notes to remove company URL audit wording from Business Leader.
- [x] 4.5 Add or update EN/ES/PT labels for the new Opportunity page where the existing content model requires them.

## 5. Verification

- [x] 5.1 Run `npm run typecheck`.
- [x] 5.2 Run `npm run lint`.
- [x] 5.3 Run `npm run build`.
- [x] 5.4 Browser-check `/implement` Business Leader path through report generation and first-pilot selection.
- [x] 5.5 Browser-check `/implement` Employee path still works after shared-flow changes.
- [x] 5.6 Browser-check `/opportunity` URL audit flow with demo fallback.
- [x] 5.7 Browser-check mobile navigation and page width at 390px and 360px for `/implement` and `/opportunity`.
