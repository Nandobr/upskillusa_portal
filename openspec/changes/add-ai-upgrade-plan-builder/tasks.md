## 1. Plan Data Model

- [x] 1.1 Define plan draft TypeScript types for Inspire, Learn, Adapt, Implement, plan levels, risk levels, and generated plan sections.
- [x] 1.2 Add original work categories, workflow pattern metadata, learning recommendations, safety questions, and after-7-days options.
- [x] 1.3 Implement deterministic plan generation utilities for partial and complete plans.

## 2. Local Plan State

- [x] 2.1 Add a client-side plan draft provider or hook with localStorage persistence.
- [x] 2.2 Support loading, updating each framework section, and clearing the saved plan draft.
- [x] 2.3 Ensure plan draft state handles missing sections and browser storage unavailability gracefully.

## 3. Framework Page Inputs

- [x] 3.1 Update Inspire inputs to collect profile, role, motivation, desired outcome, and human strengths while preserving the IKIGAI concept.
- [x] 3.2 Update Learn inputs to collect user track, AI comfort level, time available, and learning preference.
- [x] 3.3 Update Adapt inputs to collect work category, workflow pain, delays, repetitive work, judgment needs, desired outcome, and existing action-plan fields where useful.
- [x] 3.4 Update Implement inputs to collect pilot workflow details, human review gate, and safety checklist answers.
- [x] 3.5 Add Save and continue plus View plan so far actions to all four framework pages.

## 4. Plan Summary Route

- [x] 4.1 Add the `/plan` route and page component.
- [x] 4.2 Render empty, partial, and complete plan states with the correct completeness level.
- [x] 4.3 Render generated plan sections for opportunity, learning path, adaptation strategy, pilot plan, risk level, next steps, and after-7-days momentum.
- [x] 4.4 Add copy, download, and clear-plan actions.

## 5. Navigation, Content, And Styling

- [x] 5.1 Add plan-builder copy to the existing content model for EN/ES/PT where feasible.
- [x] 5.2 Update overview and framework CTAs so the plan journey is discoverable without replacing the four-step navigation.
- [x] 5.3 Style the plan inputs, progress state, and `/plan` summary according to `DESIGN.md`.
- [x] 5.4 Verify responsive layout and accessible labels/focus states for the updated forms and plan route.

## 6. Verification

- [x] 6.1 Run `npm run lint`.
- [x] 6.2 Run `npm run typecheck`.
- [x] 6.3 Run `npm run build`.
- [x] 6.4 Manually verify the four-step journey can produce Level 1, Level 2, Level 3, and Level 4 plans.
