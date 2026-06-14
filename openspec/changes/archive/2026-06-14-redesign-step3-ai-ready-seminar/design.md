## Context

The portal already uses a shared framework page implementation for `/learn` and `/adapt`. Step 2 now has a strong guided-builder pattern: compact dark hero, numbered step cards, selectable choices, progressive reveal, generated report, copy/download actions, and local save-to-plan behavior. Step 3 currently uses the same shared framework shell but still presents a generic seminar interest form plus workflow adaptation inputs.

The Stage 3 source document reframes this part of the journey as an in-person AI-Ready Seminar for workers and business leaders. The MVP should not become a full event-registration site yet. It should sell the seminar concept by helping each audience prepare something useful: a worker-facing Manifest of Saved Hours or a business-facing Company AI-Ready Action Plan.

## Goals / Non-Goals

**Goals:**

- Replace the current `/adapt` form with an AI-Ready Seminar prep builder.
- Keep the existing `/adapt` route while changing visible Step 3 navigation to `Seminar`.
- Reuse the Page 2 `/learn` interaction style: one continuous guided panel, numbered step cards, select buttons, checkboxes, inputs only where necessary, and a generated result panel.
- Serve both primary audiences: Worker / Employee and Business Leader / Owner.
- Use a shared, non-blocking readiness checklist.
- Reuse existing work-category options.
- Calculate estimated annual value created using an adjustable multiplier defaulting to `3.7x`.
- Generate track-specific markdown/text output with copy and download actions.
- Save the Step 3 result into the local AI-Ready Action Plan and continue the portal journey into Implement.
- Update English, Spanish, and Portuguese MVP copy for new visible strings.

**Non-Goals:**

- No real seminar registration, event calendar, geolocation, or event backend.
- No standalone seminar home page in this change.
- No sample plan gallery or PDF library.
- No agent matching, installer-agent workflow, or Stage 4 module embedding on Step 3.
- No Suno audio slots or two-room animation.
- No backend persistence, authentication, database schema changes, AI API calls, or external service dependencies.
- No auto-generated compensation recommendation or merit-based ask amount.

## Decisions

### Keep `/adapt`, change visible language to Seminar

The route remains `/adapt` to avoid route churn and keep the existing framework sequence intact. User-facing labels change from `Adapt` / `Adaptation` to `Seminar` / `AI-Ready Seminar`.

- Rationale: clear audience language without breaking existing links or route structure.
- Alternative considered: rename route to `/seminar`. That is cleaner semantically but unnecessary for the MVP and would expand the change surface.

### Replace the old Step 3 form entirely

The current seminar interest fields and generic workflow form will be removed from the Step 3 UI and replaced by a focused prep builder.

- Rationale: the new source document describes a different job for Step 3; patching the old form would create a muddled experience.
- Alternative considered: preserve workflow pain/main-step fields inside the new builder. That would retain more old data but make the MVP heavier and less aligned with the seminar prep goal.

### Use a role fork with shared structure

The first step asks the visitor to choose Worker / Employee or Business Leader / Owner. Both tracks share the same panel structure but use different calculator fields and result language.

- Rationale: workers and leaders both need to see value, but they need different outputs.
- Alternative considered: one neutral builder for everyone. That would be simpler, but it would underserve both audiences.

### Keep the readiness checklist non-blocking

The checklist appears as Step 2 inside the guided panel, but it never gates the builder or generated result.

- Rationale: it prepares the visitor for the seminar without stopping useful exploration.
- Alternative considered: unlock the builder only after all checklist items are complete. That would reduce engagement and make MVP testing more brittle.

### Use deterministic local value calculation

Worker annual value uses:

`weekly hours saved * hourly value * 52 * multiplier`

Business annual value uses:

`workers affected * weekly hours saved per worker * blended hourly value * 52 * multiplier`

The multiplier defaults to `3.7x` and is editable.

- Rationale: this follows the document's "working figure" and adjustable calculator requirement without pretending the number is universal.
- Alternative considered: fixed multiplier. That would be simpler but less faithful to the source document.

### Generate only after required fields are complete

The result panel appears only after the selected track has enough information to produce a meaningful artifact. Until then, the panel shows a quiet empty state.

- Rationale: avoids noisy partial results and keeps the builder feeling deliberate.
- Alternative considered: live partial preview. That would be more dynamic but harder to keep clear across two tracks.

### Treat old local Step 3 data as obsolete

Because the current plan storage is local MVP state, old Adapt data can be ignored or reset when the new Step 3 shape is introduced.

- Rationale: avoids migration complexity for a non-production local draft.
- Alternative considered: migrate old workflow fields into the new shape. That would add complexity with little practical value.

## Risks / Trade-offs

- Existing local `/adapt` drafts may no longer render as completed Step 3 data -> Treat prior Step 3 data as obsolete and allow visitors to rebuild the seminar prep output.
- Renaming visible navigation to Seminar while keeping `/adapt` could confuse developers -> Document the route/name split in code comments only if needed and keep tests focused on visible behavior.
- Business and worker tracks may still feel lightweight -> Keep the generated artifacts practical and defer richer seminar operations to the future standalone seminar home page.
- Value calculations could be interpreted as guaranteed financial outcomes -> Label the experience as an MVP/demo estimate and avoid compensation promises or automatic merit-ask recommendations.
- Draft ES/PT translations may need human review -> Keep translations simple and literal, consistent with the existing MVP translation policy.
