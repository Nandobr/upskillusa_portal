## Context

The current app is a Next.js 16, React 19, TypeScript MVP portal. The `/inspire` route renders `FrameworkPage` and currently uses `IkigaiDemo`, a compact form that saves profile-style inputs into the local AI Upgrade Plan draft. The referenced `RickMccaw/upskill-usa-dashboard` app is a static vanilla HTML/CSS/JavaScript dashboard with a richer IKIGAI assessment implemented through global mutable state, string-built HTML, inline event handlers, and a local `OCCUPATIONS` JavaScript global.

This change needs to preserve the local MVP architecture while replacing Step 1 with the richer assessment experience. The assessment must appear in-page on Inspiration, reveal subsequent sections below as the user progresses, persist full results locally, and surface the full result in `/plan`.

## Goals / Non-Goals

**Goals:**

- Rebuild the reference assessment as typed React components and pure TypeScript utilities.
- Port all 342 occupations and all assessment-specific constants required by the reference flow.
- Preserve the reference scoring behavior while making the matching function deterministic, testable, and independent of React.
- Replace the current Inspiration form with the full assessment.
- Preserve the existing Step 1 Inspiration title, tab, route, and page identity while replacing only the embedded form/demo surface.
- Persist full assessment answers, matches, comparison selections, and plan-visible result data in localStorage through the existing plan provider pattern.
- Display the full assessment result in `/plan`, including top matches, selected comparisons, and action recommendations.
- Keep the first implementation English-first, with Spanish and Portuguese falling back for assessment-specific copy.
- Follow `DESIGN.md`: polished portal widget, navy/blue/gold palette, restrained cards, demo labeling, accessible controls, mobile-safe layouts.

**Non-Goals:**

- No backend, database, auth, analytics, AI API, or external job-board integration.
- No Drizzle schema changes or migrations.
- No live labor-market data refresh.
- No full rewrite of Learn, Adapt, or Implement.
- No direct copy of the reference app's modal shell, global DOM mutation, inline handlers, or dashboard styling.
- No guarantee that vulnerability scores are authoritative career advice.

## Decisions

### 1. Port Logic, Not Architecture

The reference assessment logic will be ported into local TypeScript modules, while UI will be rebuilt in React.

- Use a pure `computeIkigaiMatches(input, occupations)` function.
- Return scored matches instead of only occupations so the UI and `/plan` can explain ranking.
- Avoid string-built HTML, global mutable `assessmentState`, and `onclick` handlers.

Alternative considered: copy the reference `app.js` into the project and mount it imperatively. This would be faster initially but would fight React state, TypeScript, accessibility, and the existing design system.

### 2. Keep Assessment Data Separate From Plan Templates

Assessment constants and occupation data should live outside `src/lib/plan.ts`.

Expected modules:

- `src/lib/ikigai-assessment.ts` for types, constants, matching, category labels, vulnerability labels, and recommendation helpers.
- `src/lib/data/occupations.ts` for the 342 occupation records.
- A dedicated React component such as `src/components/ikigai-assessment.tsx`.

`src/lib/plan.ts` should only expand enough to represent saved assessment results and render them in generated plan output.

Alternative considered: fold all assessment data into `plan.ts`. This would make the plan module too large and blur career matching with four-step plan generation.

### 3. Persist Full Results Through Existing Local Storage

The existing `PlanProvider` and `planStorageKey` will remain the local persistence boundary. `InspirePlanInput` will expand from profile fields into the full assessment result shape, including answers and generated result summary.

Persisted fields should include at least:

- selected pathway
- optional name
- current situation
- selected feelings
- selected human skills
- selected interests
- selected work styles
- top matched occupation slugs with scores
- comparison occupation slugs
- selected or best-match result details needed by `/plan`
- generated recommendation identifiers or text

Only durable identifiers and compact result fields should be stored where possible; full occupation records can be resolved from the local dataset at render time.

Alternative considered: use a separate localStorage key. Keeping one plan draft store makes clear/reset/copy/download behavior simpler and aligns with current app patterns.

### 4. In-Page Progressive Reveal

The assessment will not use a modal. Each step should appear in order on the Inspiration page, and the next step should reveal below after the required input is complete.

The page can still include progress indicators and local navigation between completed sections, but the primary interaction is scroll-forward progression.

Alternative considered: recreate the reference modal. The user specifically requested the assessment stay on Step 1 and reveal below on the same page.

### 5. English-First Copy With Fallback

The first implementation will keep assessment-specific copy in English and reuse existing EN/ES/PT framework copy where available. Spanish and Portuguese should fall back gracefully instead of showing missing labels.

This keeps the UI shippable while leaving a clear future translation task.

### 6. Demo And Source Framing

The UI and `/plan` output must label matches as local MVP/demo guidance. External BLS links may be shown from the dataset, but the app must not imply live verification, employment guarantees, official certification, or real AI generation.

## Risks / Trade-offs

- Dataset size and bundle weight -> Mitigate by storing occupations in a dedicated module and checking `next build` output. If needed later, dynamically import the dataset on `/inspire`.
- Sensitive local answers -> Mitigate by keeping persistence local, labeling that data is stored locally, and supporting the existing clear-plan reset.
- Career advice claims -> Mitigate with demo/source labels and conservative copy around vulnerability and matching.
- Product confusion between career matching and AI Upgrade Plan -> Mitigate by making Inspiration discover career direction and `/plan` summarize the full assessment result as Step 1 context before Learn/Adapt/Implement.
- Localization gap -> Mitigate with English fallback and no broken labels for ES/PT.
- Mobile comparison table overflow -> Mitigate with responsive table wrapping, horizontal scroll only inside the table container, and visual QA on mobile.

## Migration Plan

1. Extend the local plan draft shape in a backward-compatible way so old `inspire` drafts still merge with defaults.
2. Replace the Inspiration form/demo surface with the new assessment component while leaving the Step 1 Inspiration title and route identity unchanged.
3. Persist assessment results into the existing local storage key.
4. Update `/plan` output to render full assessment results when present and tolerate old lightweight Inspire drafts.
5. Keep clear-plan behavior as the rollback path for malformed local drafts.

## Open Questions

- Final legal/source attribution language for the occupation dataset should be reviewed before production launch.
- Full Spanish and Portuguese translation is intentionally deferred beyond the first implementation.
