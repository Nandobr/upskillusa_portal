## Why

The current Step 3 `/adapt` page is a generic adaptation/workflow form, but the Stage 3 source document defines a more specific seminar experience for workers and business leaders. This change turns Step 3 into a simple, useful AI-Ready Seminar prep builder that sells the seminar idea while helping both audiences prepare an actionable artifact.

## What Changes

- Rename visible Step 3 navigation from `Adapt` to `Seminar` while keeping the existing `/adapt` route.
- Reframe Step 3 as **AI-Ready Seminar** with the direct hero message **Build Your AI-Ready Action Plan**.
- Replace the current Step 3 seminar interest mini-form and workflow form entirely.
- Add a Page-2-style guided builder with:
  - Worker / Employee and Business Leader / Owner track selection.
  - A shared, non-blocking seminar readiness checklist.
  - Existing work-category selection via select buttons.
  - A workflow/problem prompt.
  - Track-specific value calculator fields.
  - An adjustable value multiplier defaulting to `3.7x`.
- Generate track-specific outputs:
  - Worker: **Manifest of Saved Hours**.
  - Business leader: **Company AI-Ready Action Plan**.
- Add copy, track-specific markdown download, save-to-plan, and continue-to-Implement actions.
- Update visible plan language from **AI Upgrade Plan** to **AI-Ready Action Plan** where appropriate, including `/plan` copy that is linked from this flow.
- Add a simple Seminar Day Preview using existing card-grid styling with Overview, Separate Tracks, Practice, and Reunion.
- Add English, Spanish, and Portuguese MVP copy for new visible Step 3 strings.
- Defer real registration, calendar, sample plan gallery, agent matching, Suno audio, two-room animation, and a standalone seminar home page.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Step 3 changes from a generic Adapt seminar/action-plan demo into an AI-Ready Seminar prep builder with track-specific results and AI-Ready Action Plan terminology.

## Impact

- Affected route: `/adapt`.
- Affected visible plan route: `/plan`.
- Affected modules are expected to include shared framework page components, portal copy, plan data utilities, local plan persistence typing, and global styles.
- The MVP remains unauthenticated, deterministic, client-side, and locally persisted only.
- No database schema changes, backend APIs, external AI APIs, external registration service, external calendar integration, or new third-party dependencies are expected.
