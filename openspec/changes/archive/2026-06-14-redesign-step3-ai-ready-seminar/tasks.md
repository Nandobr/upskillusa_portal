## 1. Step 3 Data Model And Calculation

- [x] 1.1 Replace the old Adapt plan input shape with a seminar prep shape that supports `worker` and `business` tracks
- [x] 1.2 Add readiness checklist state fields and treat old local Step 3 data as obsolete when loading the new shape
- [x] 1.3 Reuse the existing work category options for Step 3 work/business area selection
- [x] 1.4 Implement deterministic annual value calculations with an adjustable multiplier defaulting to `3.7`
- [x] 1.5 Generate track-specific result text for Manifest of Saved Hours and Company AI-Ready Action Plan
- [x] 1.6 Update overall plan generation so saved Step 3 output appears in the AI-Ready Action Plan

## 2. Step 3 Guided Builder UI

- [x] 2.1 Replace the current `/adapt` seminar interest and workflow form with one continuous guided panel
- [x] 2.2 Add Step 1 track selector buttons for Worker / Employee and Business Leader / Owner
- [x] 2.3 Add Step 2 shared readiness checklist with non-blocking readiness feedback
- [x] 2.4 Add work/business area select buttons using the existing work category taxonomy
- [x] 2.5 Add workflow/problem input and track-specific value estimate fields
- [x] 2.6 Render an empty state until required fields are complete
- [x] 2.7 Render the track-specific result panel only after required fields are complete
- [x] 2.8 Add copy, track-specific markdown download, save-to-plan, and continue-to-Implement actions

## 3. Seminar Page Content And Navigation

- [x] 3.1 Change visible Step 3 navigation label from Adapt to Seminar while keeping route `/adapt`
- [x] 3.2 Update Step 3 hero to use `STEP 3 · AI-Ready Seminar` and `Build Your AI-Ready Action Plan`
- [x] 3.3 Include the promise line `We don't fire. We upgrade.` once on the Step 3 page
- [x] 3.4 Add the Seminar Day Preview as four existing card-grid cards: Overview, Separate Tracks, Practice, Reunion
- [x] 3.5 Ensure no Agents, registration, calendar, sample plan gallery, audio, or animation content appears in this MVP Step 3 page

## 4. Copy And Plan Naming

- [x] 4.1 Update visible plan terminology from AI Upgrade Plan to AI-Ready Action Plan where appropriate
- [x] 4.2 Update `/plan` visible page copy and plan-related actions to align with AI-Ready Action Plan naming
- [x] 4.3 Add English copy for all new Step 3 strings and result labels
- [x] 4.4 Add simple MVP Spanish draft translations for new Step 3 strings
- [x] 4.5 Add simple MVP Portuguese draft translations for new Step 3 strings
- [x] 4.6 Verify old Adaptation wording does not remain in visible Step 3 page copy except where route/internal naming requires it

## 5. Styling And Accessibility

- [x] 5.1 Reuse Page 2 guided-builder visual patterns: numbered step cards, select buttons, selected states, result panels, and compact actions
- [x] 5.2 Add only scoped CSS needed for Step 3 calculator/result/readiness elements
- [x] 5.3 Verify focus states, `aria-pressed` states, checkbox labels, and result action buttons are accessible
- [x] 5.4 Verify desktop and mobile layouts avoid horizontal scrolling and text overflow

## 6. Verification

- [x] 6.1 Verify worker track generates Manifest of Saved Hours only after required fields are complete
- [x] 6.2 Verify business track generates Company AI-Ready Action Plan only after required fields are complete
- [x] 6.3 Verify copy and download actions produce the correct track-specific output and filenames
- [x] 6.4 Verify saving Step 3 marks the local AI-Ready Action Plan progress complete and `/plan` reflects the new Step 3 result
- [x] 6.5 Run lint, type check, and production build verification commands
- [x] 6.6 Visually verify `/adapt` and `/plan` at desktop and mobile widths
