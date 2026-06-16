## 1. Navigation And Copy

- [x] 1.1 Remove `Opportunity` from EN/ES/PT desktop and mobile navigation content arrays.
- [x] 1.2 Update Step 4 Business Leader audience copy to describe a company URL audit and first pilot selection.
- [x] 1.3 Update Step 4 demo notes so company URL audit language lives in the Business Leader path again.
- [x] 1.4 Keep `/opportunity` route available but unlinked.

## 2. Business Leader Audit Path

- [x] 2.1 Restore Business Leader Step 4 branch with company URL input as the first path input.
- [x] 2.2 Reveal contact email input after the Business Leader enters a valid company URL, in the same guided path.
- [x] 2.3 Trigger `/api/analyze-business-opportunity` only when URL and email are valid.
- [x] 2.4 Render Business Leader loading checklist for company audit generation.
- [x] 2.5 Render `BusinessOpportunityReportView` inside Step 4 after audit generation.
- [x] 2.6 Preserve labeled demo fallback when live audit keys are missing or the live audit fails.
- [x] 2.7 Wire first-opportunity selection to `pilotFromBusinessOpportunity` and the guardrails/save step.

## 3. Employee Path Preservation

- [x] 3.1 Keep Employee / Worker work-area selector unchanged.
- [x] 3.2 Keep task chips, custom task entry, selected count, and Task Transformation Report generation unchanged.
- [x] 3.3 Keep Employee first-pilot selection and guardrails/save behavior unchanged.

## 4. Saved Plan And Compatibility

- [x] 4.1 Save Business Leader company URL, email, business audit report, selected pilot, and guardrails in local Step 4 plan state.
- [x] 4.2 Update AI-Ready Action Plan output to describe Business Leader saved data as a company AI Opportunity Report.
- [x] 4.3 Preserve compatibility for older local drafts that contain Business Leader personal readiness reports.
- [x] 4.4 Ensure Start Over clears only Step 4 Business Leader or Employee selections and reports.

## 5. Verification

- [x] 5.1 Run `npm run lint`.
- [x] 5.2 Run `npm run typecheck`.
- [x] 5.3 Run `npm run build`.
- [x] 5.4 If browser checks are approved, verify `/implement` Business Leader URL/email/audit/report/first-pilot flow. Browser check not run; approval not given yet.
- [x] 5.5 If browser checks are approved, verify `/implement` Employee task transformation flow still works. Browser check not run; approval not given yet.
- [x] 5.6 If browser checks are approved, verify desktop and mobile nav no longer show Opportunity. Browser check not run; approval not given yet.
