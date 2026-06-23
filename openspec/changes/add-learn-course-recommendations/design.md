## Context

The Learn page is currently a guided four-step local pathway: the visitor selects a learner group, practical goal, AI tool, and preferred learning format. The page then generates a local LEARN report with a profile summary, recommended learning path, starter guide, practice prompt, and next action.

The attached `unified_ai_courses_deduped.csv` contains 143 deduplicated AI courses with fields that already match the intended catalog model: title, provider, direct URL, language, access model, audience, level, technical intensity, topic, path order, and fit reason. This data should become a repo-owned static catalog before it is used by the app; the app should not depend on a file in `Downloads`.

## Goals / Non-Goals

**Goals:**

- Add four useful course recommendations to the Learn report using the visitor's current Learn answers.
- Keep the course recommendation experience compact and mobile-friendly.
- Make recommendations explainable: each card maps to one slot in a simple learning sequence.
- Ensure educators receive practical tool fluency recommendations in addition to education-specific AI courses.
- Preserve the existing local-only MVP architecture and multilingual shell.

**Non-Goals:**

- No full searchable catalog page.
- No database, enrollment tracking, authentication, analytics, or external API.
- No AI-generated recommendation call.
- No automatic syncing from the CSV after implementation; updates can be handled by replacing or regenerating the typed catalog data.
- No translation of course titles or provider names beyond displaying source-provided language metadata.

## Decisions

### Store course data as typed static app data

Convert the CSV into a TypeScript data module such as `src/lib/data/ai-courses.ts` with a narrow `AiCourse` type.

- Rationale: static typed data is easy to bundle, review, test, and use in deterministic helper functions.
- Alternative considered: parse the CSV at runtime. That would require bundling CSV parsing behavior into the app and creates unnecessary runtime failure modes for an MVP.
- Alternative considered: keep the CSV in `public/` and fetch it client-side. That makes updates easy, but it adds loading/error states and delays recommendations that can be instant.

### Recommend four slots, not a full list

Always try to show four recommendation slots:

1. Understand AI
2. Learn your tool
3. Use AI in your role
4. Use AI responsibly

- Rationale: four stacked cards read well on smartphones and create a clear learning sequence: basics, tool fluency, role application, responsible use.
- Alternative considered: show two or three cards. Fewer cards are simpler, but they either omit responsible AI or make educators choose between practical tool learning and teaching application.

### Use deterministic ranking

Create a helper such as `getLearnCourseRecommendations(input, language)` that scores courses using:

- selected language and source language metadata
- learner group and audience terms
- selected goal and topic/fit-reason terms
- selected tool and provider/topic terms
- card slot path order
- level and technical intensity
- access model

- Rationale: deterministic ranking is transparent, testable, fast, and avoids implying real AI personalization.
- Alternative considered: ask an AI model to choose recommendations. That could produce richer explanations, but it adds cost, latency, hallucination risk, and source verification concerns.

### Prefer slot-specific diversity

The recommendation helper should avoid duplicates across the four slots. If a slot lacks a strong exact match, it should backfill with the best general free AI course for that slot rather than leaving an empty card.

- Rationale: a complete four-card sequence is better for the MVP demo and mobile layout.
- Alternative considered: hide weak slots. That creates inconsistent report length and can make the experience feel broken for less common combinations.

### Treat educators as both tool users and educators

For educator selections, the tool slot should still prioritize practical ChatGPT, NotebookLM, Gemini, Copilot, or Claude courses. The role slot can then prioritize teaching, student guidance, feedback, classroom policy, or responsible-use courses.

- Rationale: educators need practical fluency with the tools before they can teach or govern them well.
- Alternative considered: route all educator recommendations to education-specific courses. That is relevant but can skip the hands-on tool practice needed for confidence.

### Keep course cards compact

Each course card should show:

- slot label
- title
- provider
- level, access model, and language metadata
- short fit reason
- direct course link

- Rationale: compact cards fit the existing report style and smartphone layouts.
- Alternative considered: expose every CSV field. That would be more complete but too dense for the Learn report.

## Risks / Trade-offs

- CSV quality varies across providers -> Keep factual fields source-backed, preserve `NaN`/blank values where needed, and avoid overpromising certificates or time commitments.
- Path order text is inconsistent -> Parse only the leading number where available and combine it with topic/level scoring.
- Course catalog can become stale -> Keep the data module easy to regenerate from a refreshed CSV and include source fields in code review.
- English-only courses may dominate -> Boost selected-language matches, but allow English-only backfill when no ES/PT course fits the slot.
- Static catalog increases bundle size -> 143 compact records is acceptable for MVP; if the catalog grows substantially, move to a fetched JSON asset or server route later.

## Migration Plan

1. Convert the deduped CSV into a reviewed static course data module.
2. Add deterministic recommendation helpers and unit-style coverage for representative learner profiles.
3. Extend the Learn report model/text export with four course recommendations.
4. Render compact responsive course cards in the Learn report.
5. Verify desktop and mobile Learn flows for student, worker, educator, and entrepreneur paths in EN, ES, and PT where feasible.
