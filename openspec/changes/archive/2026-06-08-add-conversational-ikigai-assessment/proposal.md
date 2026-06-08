## Why

The current Inspiration step is a lightweight form, but the desired experience is a full conversational IKIGAI assessment that helps visitors discover AI-resilient career directions before moving through the rest of the UpSkill USA journey. The referenced dashboard already contains the pathway structure, occupation dataset, matching rules, comparison model, and action-plan copy needed to make Step 1 substantially more useful.

## What Changes

- Replace the current Step 1 Inspiration form with an in-page progressive Conversational IKIGAI Assessment.
- Preserve the existing Step 1 framework title, tab, route, and page identity; only the form/demo area changes.
- Port the four pathway experiences from `RickMccaw/upskill-usa-dashboard`: Career Explorer, Market Ready Check, Career Pivot Navigator, and AI Amplification Path.
- Port all assessment input data from the reference assessment:
  - pathway preambles and current-situation options
  - feeling chips
  - human skills
  - interest areas
  - work-style options
  - vulnerability labels/category helpers
  - pathway-specific recommendations
- Port all 342 occupations from the reference `OCCUPATIONS` dataset and use them for deterministic local matching.
- Convert the reference matching logic into typed local utilities instead of copying global DOM code.
- Render the full 8-step assessment on the same Inspiration page, revealing each next section below as the visitor progresses.
- Persist the full assessment result in local browser storage and surface it in `/plan`.
- Keep the first implementation English-first, with Spanish and Portuguese falling back where translated copy is not yet available.
- Preserve the current public, unauthenticated, client-side MVP architecture: no backend, authentication, database, or AI API calls.
- Label generated matches and plan outputs as local MVP/demo guidance and avoid implying employment guarantees or authoritative labor-market certification.

## Capabilities

### New Capabilities

- `conversational-ikigai-assessment`: Full in-page IKIGAI assessment, occupation matching, career comparison, pathway recommendations, local persistence, and `/plan` assessment-result output.

### Modified Capabilities

- `upskillusa-mvp-portal`: The Inspire route changes from a simple IKIGAI demo/form into the full conversational assessment while preserving the four-step portal sequence and public route behavior.

## Impact

- Affected routes: `/inspire` and `/plan`.
- Affected modules are expected to include:
  - `src/components/portal-pages.tsx`
  - new assessment component module(s)
  - `src/lib/plan.ts`
  - `src/components/plan-provider.tsx`
  - `src/lib/content.ts`
  - new typed assessment/data modules under `src/lib`
  - `src/app/globals.css`
- Local storage shape will expand to include full assessment answers, matches, comparison selections, and plan-visible result data.
- No database schema changes, Drizzle commands, backend routes, authentication, external AI calls, or new runtime dependencies are expected.
- Verification should include `npm run lint`, `npm run typecheck`, `npm run build`, and manual desktop/mobile validation of the full Inspiration-to-plan flow.
