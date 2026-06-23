## 1. Course Catalog Data

- [x] 1.1 Review `unified_ai_courses_deduped.csv` columns and normalize missing values without inventing source facts.
- [x] 1.2 Create a typed `AiCourse` model and static catalog module from the deduped CSV.
- [x] 1.3 Preserve direct URLs, provider, language, access model, audience, level, technical intensity, main topic, path order, and fit reason in the catalog.
- [x] 1.4 Add a lightweight check or fixture review to confirm the catalog includes expected ChatGPT, Claude, Gemini/Google, Copilot/Microsoft, educator, business, and responsible-AI examples.

## 2. Recommendation Logic

- [x] 2.1 Create a deterministic recommendation helper that accepts `LearnPlanInput` and selected language.
- [x] 2.2 Implement slot ranking for Understand AI, Learn your tool, Use AI in your role, and Use AI responsibly.
- [x] 2.3 Score language, audience/group, goal/topic, selected tool/provider, path order, level, technical intensity, and access model.
- [x] 2.4 Prevent duplicate course recommendations across the four slots and backfill weak slots with the best general match.
- [x] 2.5 Ensure educator recommendations include practical tool fluency in the tool slot and education-specific application in the role slot.

## 3. Learn Report Integration

- [x] 3.1 Extend the Learn report type to include four course recommendations with slot labels and source course metadata.
- [x] 3.2 Add course recommendations to `generateLearnReport` and `learnReportToText`.
- [x] 3.3 Preserve current save/copy/download behavior with course recommendations included in saved Learn report text where appropriate.
- [x] 3.4 Keep existing Learn pathway answers and report sections intact.

## 4. Learn Page UI

- [x] 4.1 Add a compact Recommended Free Courses section to the generated Learn report.
- [x] 4.2 Render four mobile-friendly course cards with title, provider, level, access model, language metadata, fit reason, and direct course link.
- [x] 4.3 Style the cards using existing design-system patterns, avoiding table layouts and horizontal scrolling on smartphone widths.
- [x] 4.4 Add EN/ES/PT shell labels for the recommendation section and slot labels while leaving course titles/providers in their source language.

## 5. Verification

- [x] 5.1 Run `npm run localization:test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [x] 5.2 Run `openspec validate --all`.
- [x] 5.3 Browser-test Learn recommendations for at least student, worker, educator, and entrepreneur paths.
- [x] 5.4 Browser-test selected-tool behavior for ChatGPT, Claude, Gemini, Copilot, and NotebookLM.
- [x] 5.5 Browser-test smartphone viewport layout for the four stacked recommendation cards.
