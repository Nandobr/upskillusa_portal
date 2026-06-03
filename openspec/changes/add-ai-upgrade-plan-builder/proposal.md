## Why

The current portal explains the Inspire -> Learn -> Adapt -> Implement framework through four separate demo forms, but those inputs do not accumulate into a useful outcome for the visitor. UpSkill USA needs the four-step journey to produce practical guidance: a progressive AI Upgrade Plan that gives users value even when they complete only part of the journey and a complete next-steps plan after Implement.

## What Changes

- Convert the four existing framework page demos into progressive AI Upgrade Plan inputs:
  - Inspire captures the user profile, role, motivation, desired outcome, and human strengths.
  - Learn captures AI comfort level, time available, and learning preference.
  - Adapt captures workflow category, workflow pain, process friction, repetitive work, delays, and human judgment needs.
  - Implement captures pilot workflow details, human review gate, and NIST-inspired safety checklist answers.
- Add a `/plan` route that displays the user's current plan state at any point in the journey.
- Support four plan completeness levels:
  - Level 1: Opportunity Seed after Inspire.
  - Level 2: Learning Path after Learn.
  - Level 3: AI Opportunity Draft after Adapt.
  - Level 4: Complete AI Upgrade Plan after Implement.
- Add "View plan so far" and sequential "Save and continue" actions to each framework page.
- Persist plan progress locally in the browser for the MVP using client-side storage only.
- Generate deterministic, template/rules-based plan output without real AI generation, backend persistence, authentication, or database schema changes.
- Include next-step guidance in every plan:
  - Partial plans include a next 3 days section and a prompt to continue the next framework step.
  - Complete plans include a next 7 days section and an "After 7 Days: Choose Your Next Move" section.
- Add copy/download support for the plan output.
- Keep EN/ES/PT support aligned with the current MVP content system where feasible, with translations treated as draft copy for human review.

## Capabilities

### New Capabilities

- `ai-upgrade-plan-builder`: Progressive four-step plan generation, local plan persistence, completeness levels, next-step guidance, and `/plan` summary output.

### Modified Capabilities

- `upskillusa-mvp-portal`: Existing framework routes now contribute to a shared AI Upgrade Plan journey rather than acting only as isolated demo experiences.

## Impact

- Affected routes: `/`, `/inspire`, `/learn`, `/adapt`, `/implement`, and new `/plan`.
- Affected modules: content constants, framework page components, language provider or adjacent client state helpers, and global styles.
- New local client-side plan data model and deterministic plan generation utilities.
- No backend API, authentication, database, external AI API, analytics, or dependency changes are expected for the MVP.
