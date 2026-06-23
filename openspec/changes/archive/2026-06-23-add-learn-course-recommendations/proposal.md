## Why

The Learn page currently creates a useful local LEARN report from the visitor's group, goal, tool, and preferred learning format, but it does not connect that profile to concrete external courses. Adding a small set of trusted free-course recommendations makes Step 2 more actionable for the MVP presentation without turning the page into a full catalog.

## What Changes

- Add four recommended free-course cards to the generated Learn report:
  - Understand AI
  - Learn your tool
  - Use AI in your role
  - Use AI responsibly
- Use the existing `unified_ai_courses_deduped.csv` course data as the source for a typed in-app course catalog.
- Recommend courses from the visitor's existing Learn answers: group, goal, selected tool, preferred format, and selected language.
- Keep the UI mobile-first and compact: four stacked cards on small screens, each with title, provider, level, access/language metadata, fit reason, and a direct course link.
- Ensure educators receive practical tool-learning recommendations for ChatGPT, NotebookLM, Gemini, Copilot, or Claude in addition to education-specific AI courses.
- Keep the implementation local and deterministic for MVP; do not add a database, AI API call, full catalog page, account system, or course enrollment tracking.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: The Learn route changes from a locally generated learning-path report to a report that also recommends four trusted free or free-to-audit AI courses matched to the visitor's answers.

## Impact

- `src/lib/data/ai-courses.ts`: new typed course data derived from the deduped CSV.
- `src/lib/course-recommendations.ts`: new deterministic recommendation and ranking helper.
- `src/lib/plan.ts`: extend the Learn report model and text export with course recommendations.
- `src/components/portal-pages.tsx`: render four compact course cards in the Learn report.
- `src/app/globals.css`: responsive styling for course recommendation cards if existing report styles are not sufficient.
- OpenSpec/tests/QA: update Learn route requirements and verify localization, mobile layout, and recommendation behavior.
