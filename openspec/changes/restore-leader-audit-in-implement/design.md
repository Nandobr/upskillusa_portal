## Context

The current app has two related flows: Step 4 `/implement`, which now supports personal readiness/task transformation, and `/opportunity`, which runs a company URL audit. The user wants the company audit back inside the Business Leader path on Step 4, with email collected after URL in the same Business Leader path, while preserving the Employee path as a task transformation builder.

The app already has most of the needed pieces: `/api/analyze-business-opportunity`, `BusinessOpportunityReportView`, `pilotFromBusinessOpportunity`, local `ImplementPlanInput` fields for company URL/email/business report, and guardrail/save components. The change should reconnect those pieces to `/implement` and remove the Opportunity nav link.

## Goals / Non-Goals

**Goals:**

- Restore Business Leader Step 4 as a company URL/email audit journey.
- Ask for email only after a valid company URL, still inside the Business Leader path.
- Reuse the existing company audit endpoint, report UI, print/save affordance, demo fallback, first opportunity selection, and guardrails/save flow.
- Keep Employee Step 4 unchanged as work area/task selection and Task Transformation Report.
- Remove Opportunity from desktop and mobile navigation in all languages.
- Keep `/opportunity` route unlinked for now to avoid broken URLs.
- Preserve compatibility with older locally saved Step 4 personal-readiness and business-audit draft data.

**Non-Goals:**

- No deletion of `/opportunity` route in this change.
- No Supabase/auth/lead storage/email delivery.
- No redesign of Employee task transformation report.
- No new external services or API keys.
- No browser checks unless explicitly approved.

## Decisions

### Use role branching inside Step 4

Step 4 will branch immediately after audience choice:

- Business Leader: URL input -> email/contact input -> company opportunity audit -> first pilot -> guardrails/save.
- Employee / Worker: work area -> task chips/custom tasks -> Task Transformation Report -> first pilot -> guardrails/save.

Rationale: leaders and employees have different jobs-to-be-done. Leaders need organizational opportunity evidence first; employees need task-level personal transformation.

Alternative considered: keep both audiences on work-area/task selection. That makes the leader flow too personal and duplicates the separate URL audit page.

### Collect URL and email as one path, not one combined row

The Business Leader path should first ask for company URL. Once valid, reveal the email/contact field below it in the same guided panel. The report button appears only when both URL and email are valid.

Rationale: this satisfies "ask email after the URL, in the same step" without forcing two separate top-level steps or showing unanswered future fields too early.

Alternative considered: show URL and email side-by-side immediately. That is faster but less guided and less aligned with the current progressive Step 4 pattern.

### Reuse business audit report model

Business Leader report state should use `BusinessOpportunityReport`, render through `BusinessOpportunityReportView`, and select pilots via `pilotFromBusinessOpportunity`.

Rationale: the current Opportunity page already has the intended company-level output, KPI cards, first opportunities, demo fallback, and print/save behavior.

Alternative considered: create a new leader report schema. That would duplicate existing audit output and slow the MVP.

### Leave `/opportunity` route available but unlinked

Remove Opportunity from navigation, but do not delete the route yet.

Rationale: deployed URLs, Vercel previews, or shared links may still exist. Unlinking is enough to restore the intended portal journey without a breaking route removal.

Alternative considered: delete `/opportunity`. That is cleaner eventually, but unnecessary for this step.

## Risks / Trade-offs

- Existing local drafts may contain leader personal readiness reports -> Keep tolerant rendering and save logic so old drafts do not crash.
- Business Leader path may feel longer with URL then email -> Keep both in one guided panel and reveal email immediately after URL validation.
- Keeping `/opportunity` route unlinked may leave duplicate functionality reachable by direct URL -> Accept for now; later archive/delete can remove it intentionally.
- Removing nav item may crowd less but change user discovery -> Business Leader card and Step 4 notes must clearly explain the company audit path.

## Migration Plan

1. Update nav content arrays to remove Opportunity links.
2. Update `/implement` Business Leader branch to URL/email audit flow.
3. Reconnect audit endpoint and report rendering to Business Leader path.
4. Update save-to-plan output for business audit reports.
5. Update Step 4 notes and audience copy.
6. Run lint, typecheck, and build.
7. Browser-check only if approved.

Rollback: revert this change to restore the separate Opportunity nav/page entry and Business Leader personal readiness path.

## Open Questions

- None for MVP. Decision confirmed: email is asked after URL, inside the same Business Leader path.
