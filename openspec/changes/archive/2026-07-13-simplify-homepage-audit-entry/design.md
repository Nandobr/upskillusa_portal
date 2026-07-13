## Context

The overview currently renders a full homepage audit form, calls the business audit API, renders a homepage-specific report, and persists that report and contact email under `upskillusa.homepageAuditReport.v1`/`.v2`. The Implement business-leader path independently collects the same inputs, calls the same API, and renders the canonical `BusinessOpportunityReportView`.

The application already has a global Plan Provider whose `updateImplement` method writes the Implement draft synchronously before navigation. `ImplementDemo` initializes and resynchronizes from that draft, so the homepage can hand off a company URL without adding query parsing, a second API orchestration path, or report transfer logic.

The homepage must keep its current eyebrow, headline, introduction, overview heading, and four framework cards. The requested hero treatment adds only a URL launcher and Watch Demo action. The trust-claim row shown in the reference is intentionally excluded because its timing and security claims are not substantiated.

## Goals / Non-Goals

**Goals:**

- Make the homepage hero a URL-only launcher into the canonical Implement business-leader audit.
- Use the exact English CTA `Get your free AI Opportunity Report` plus equivalent Spanish and Brazilian Portuguese copy.
- Ensure the homepage never collects email, calls the audit endpoint, renders audit loading/errors from the provider, or displays/persists a report.
- Open Implement with Business Leader selected, the submitted URL prefilled, email empty, and no stale Step 4 output.
- Keep the overview heading and exactly four existing framework cards directly below the hero.
- Keep a localized Watch Demo link to `/demo`.
- Remove the obsolete homepage audit components, storage behavior, legacy stored data, and every unused `.homepage-audit-*` style.
- Preserve direct Implement and employee-path behavior, the audit API/services/calculations, and the shared report renderer.

**Non-Goals:**

- Do not generate or render an audit report on the homepage.
- Do not change the Implement form, report output, API, email behavior, cost model, or employee-estimation methodology.
- Do not add query-parameter intake, a new store, a second report-transfer format, or a new dependency.
- Do not remove or redirect `/opportunity`; its separate UI and copy are outside this homepage-focused change.
- Do not add replacement speed, security, privacy, or performance marketing claims.

## Decisions

1. **Use the homepage as a launcher, not an audit client.**
   - Add a controlled URL form inside the existing overview hero.
   - A valid submit writes the Implement draft and navigates to `/implement`.
   - The homepage makes zero requests to `/api/analyze-business-opportunity`.
   - Alternative: call the audit API on the homepage and transfer the report. Rejected because it retains duplicate orchestration, requires email on the homepage, and creates report synchronization and retry complexity.

2. **Use the existing Plan Provider for the handoff.**
   - Write a fresh `defaultDraft.implement` with `audience: "business"`, the trimmed company URL, `email: ""`, and all report, pilot, saved, workflow, guardrail, and employee-selection state reset to defaults.
   - `updateImplement` replaces only `draft.implement`, so Inspire, Learn, and Adapt progress remains intact.
   - This deliberately replaces any existing Step 4 draft. The single-slot Implement model cannot safely stage a second company while preserving hidden business/employee report state.
   - Alternative: navigate with `?website=`. Rejected because it requires new Implement query/hydration logic and is not a homepage-only behavioral change.

3. **Keep the existing homepage narrative and four-card journey.**
   - Preserve the current eyebrow, headline, and introduction above the launcher.
   - Preserve the overview heading and `FrameworkCards` order, routes, and behavior directly below the hero, while renaming the user-facing first framework from `Inspire` to `Imagine` and keeping `/inspire` as the stable internal route.
   - Place a real Watch Demo link to `/demo` near the launcher.

4. **Use localized, accessible launcher copy without trust claims.**
   - English CTA is exactly `Get your free AI Opportunity Report`.
   - Proposed localized equivalents are `Obtén gratis tu reporte de oportunidad con IA` (ES) and `Obtenha gratuitamente seu relatório de oportunidade com IA` (PT-BR), subject to the existing localization review process.
   - Add localized URL label, placeholder, and validation error; reuse the existing localized Watch Demo label.
   - Use a real associated label, `autoComplete="url"`, `inputMode="url"`, Enter submission, visible focus, `role="alert"`, decorative icons, and controls at least 44px high.
   - Remove the entire trust-claim row. Do not render `30-second audit`, `Enterprise-grade security`, or replacement claims on the homepage.

5. **Give the launcher its own responsive hero styles and remove the legacy audit CSS.**
   - Use a wide desktop form with a flexible input and CTA; allow long localized CTA text to wrap without clipping.
   - Stack the input and CTA below 620px and verify no overflow at 320px and 390px.
   - Remove all base and responsive `.homepage-audit`/`.homepage-audit-*` selectors, including selectors embedded in grouped media rules.
   - Retain shared styles such as `.spin`, `.employee-estimate-disclosure`, `.business-audit-*`, and any helpers used by Implement reports.
   - Keep desktop controls compact but at least 44 pixels high, and enlarge primary header navigation typography without introducing wrapping or collision.
   - Treat the separate homepage Watch Demo action as a compact secondary desktop control: reduce its 48-pixel presentation by about 30 percent, while restoring a 44-pixel minimum at smartphone widths.
   - Reduce only the homepage hero headline scale by roughly 10–15 percent on desktop; keep page-level hero headings unchanged and retain readable mobile wrapping.

6. **Retire homepage report persistence with a privacy-safe cleanup.**
   - Delete homepage report hydration, validation, write, clear, and report-rendering code.
   - On homepage mount, best-effort remove `upskillusa.homepageAuditReport.v1` and `.v2` so old reports/contact emails are not left indefinitely.
   - Storage denial or malformed prior data must not prevent the hero launcher from working.
   - Do not create a replacement homepage report-storage key.

7. **Remove only homepage-specific report helpers.**
   - Delete `HomepageAuditPayload`, stored-homepage-report types/constants/helpers, `HomepageAuditSection`, and `HomepageAuditReport` when no longer referenced.
   - Retain shared employee-estimate presentation, formatting, copy/print, and `BusinessOpportunityReportView` helpers used by Implement.

## Risks / Trade-offs

- [Submitting from Home replaces existing Step 4 progress] → Reset only the Implement draft, keep the other three framework drafts, and make the CTA's destination clear.
- [Browser storage is unavailable] → Treat cleanup as best effort; validation and navigation must still work. The existing Plan Provider also degrades without throwing, though URL prefill cannot be guaranteed when storage is blocked.
- [The visitor expects an immediate report after the hero CTA] → The CTA routes to a prefilled Business Leader intake where the required email is visibly collected before generation.
- [Long localized CTA copy clips or causes overflow] → Use a flexible desktop grid, permit button wrapping, and stack controls on mobile.
- [Deleting homepage code accidentally removes shared report helpers] → Verify references before deletion and regression-test direct Implement business and employee flows.
- [Unsubstantiated claims still exist on `/opportunity`] → Keep that route explicitly outside this homepage-only change and track any global claim cleanup separately.

## Migration Plan

1. Add localized homepage launcher copy and the hero URL form/handoff behavior.
2. Verify the Home-to-Implement flow before deleting the old homepage audit section.
3. Remove homepage-specific audit/report/storage code and all `.homepage-audit-*` selectors.
4. Add the one-time best-effort legacy storage cleanup.
5. Run deterministic unit/service checks, localization checks, lint, typecheck, production build, and browser verification at desktop/mobile widths.
6. Roll back by restoring the previous homepage section and styles; the unchanged Implement audit remains operational throughout.

## Open Questions

- No blocking questions remain for this homepage-only proposal.
