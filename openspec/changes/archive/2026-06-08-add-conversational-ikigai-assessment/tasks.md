## 1. Assessment Data And Utilities

- [x] 1.1 Convert the reference `OCCUPATIONS` dataset into a typed local TypeScript module with all 342 occupation records.
- [x] 1.2 Add typed assessment constants for pathways, current-situation options, feeling chips, human skills, interest areas, work-style options, category labels, and vulnerability labels.
- [x] 1.3 Implement a pure deterministic matching utility that accepts assessment answers and returns the top 12 scored occupation matches.
- [x] 1.4 Implement comparison and recommendation helpers for selected occupations and pathway-specific action guidance.
- [x] 1.5 Add lightweight unit-style assertions or scriptable checks for the matching utility if the project has an available test pattern; otherwise verify with type checking and focused manual cases.

## 2. Plan State And Persistence

- [x] 2.1 Expand the Inspire plan draft type to represent full assessment answers, matched occupation slugs with scores, comparison selections, and recommendations.
- [x] 2.2 Update default draft merging to remain backward-compatible with previously saved lightweight Inspire drafts.
- [x] 2.3 Update the plan provider/localStorage flow so full assessment results persist and clear with the existing plan draft.
- [x] 2.4 Update generated plan text utilities so copied/downloaded plans include assessment result summaries.

## 3. Inspiration Assessment UI

- [x] 3.1 Build a dedicated React assessment component for the in-page progressive flow.
- [x] 3.2 Replace the current `IkigaiDemo` Step 1 form with the new assessment component while keeping the Step 1 Inspiration title, tab, route, and page identity unchanged.
- [x] 3.3 Implement pathway selection and pathway-specific preamble/current-situation content.
- [x] 3.4 Implement progressive reveal for name, situation, feelings, human skills, interests, work style, match results, comparison, and action plan sections.
- [x] 3.5 Ensure completed sections remain visible or reviewable and support editing without losing later saved state unexpectedly.
- [x] 3.6 Add save/view-plan actions that persist the full assessment result and route to `/plan`.

## 4. Results, Comparison, And Plan Output

- [x] 4.1 Render top 12 match cards with rank, title, category, vulnerability, pay, growth, and employment size.
- [x] 4.2 Allow up to three matches to be selected for side-by-side comparison.
- [x] 4.3 Render comparison metrics for vulnerability, exposure, employment, median pay, growth outlook, and education.
- [x] 4.4 Display exposure rationale and source URLs for compared occupations.
- [x] 4.5 Generate and render pathway-specific personalized action recommendations.
- [x] 4.6 Update `/plan` to display selected pathway, answer summary, top matches, compared careers, and recommendations.
- [x] 4.7 Ensure `/plan` handles old lightweight Inspire drafts without crashing and prompts visitors to complete the new assessment.

## 5. Copy, Styling, And Accessibility

- [x] 5.1 Add English-first assessment copy with Spanish and Portuguese fallback behavior for untranslated assessment labels.
- [x] 5.2 Style pathway cards, progressive sections, chips, skill cards, match cards, comparison table, and action plan according to `DESIGN.md`.
- [x] 5.3 Add local MVP/demo guidance labels and conservative source/disclaimer copy for occupation matches and vulnerability scores.
- [x] 5.4 Verify keyboard interaction, focus states, semantic controls, and accessible labels for all assessment choices.
- [x] 5.5 Verify desktop and mobile layouts, including comparison-table behavior without page-level horizontal overflow.

## 6. Verification

- [x] 6.1 Run `npm run lint`.
- [x] 6.2 Run `npm run typecheck`.
- [x] 6.3 Run `npm run build`.
- [x] 6.4 Manually verify the full Inspiration flow for all four pathways.
- [x] 6.5 Manually verify persistence by saving, refreshing, opening `/plan`, copying/downloading the plan, and clearing local progress.
- [x] 6.6 Manually verify Spanish and Portuguese language selections use fallback copy without broken labels.
