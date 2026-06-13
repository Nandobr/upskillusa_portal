## Why

The current Learn page explains Step 2 conceptually, but it does not yet show the core LEARN value: helping a visitor find a right-sized path into common AI tools. UpSkill USA needs a small product prototype that replaces the static Learn demo with a guided pathway and downloadable LEARN Report while avoiding discipline-, department-, or industry-specific complexity.

## What Changes

- Replace the current `/learn` demo with a cascading, selectable LEARN pathway prototype.
- Add a first filter for four broad user groups:
  - Student
  - Educator
  - Worker
  - Entrepreneur
- Add selectable follow-up filters for AI starting point, practical goal, tool, learning format, and available time.
- Keep most filter steps to three options, with four options for general LLM/tool selection when needed to include ChatGPT, Claude, Gemini, and Microsoft Copilot.
- Generate a compact LEARN Report from the selected options.
- Allow the visitor to copy or download the LEARN Report as an internal demo artifact.
- Use internal deterministic report content only for the MVP, such as profile summary, recommended learning path, starter guide, practice prompt, and next action.
- Allow the visitor to save the generated LEARN Report summary to the local AI Upgrade Plan.
- Treat saving Step 2 as completing the Learn portion of the AI Upgrade Plan, but do not automatically navigate or advance the visitor to Step 3.
- Explicitly exclude department-specific, discipline-specific, job-category-specific, industry-specific, live AI generation, external content curation, community, and contributor workflows from this MVP.

## Capabilities

### New Capabilities
- `learn-tool-pathway-mvp`: Cascading Step 2 LEARN pathway, generated downloadable LEARN Report, and save-to-plan behavior for common AI tool learning.

### Modified Capabilities
- `upskillusa-mvp-portal`: The Learn route changes from a static resource hub demo to a guided product prototype while preserving the existing four-framework navigation and visual design system.

## Impact

- Affected route: `/learn`.
- Affected modules are expected to include shared framework page components, Step 2 plan data utilities, Learn-specific content/configuration, and global styles.
- The MVP remains unauthenticated, client-side, deterministic, and locally persisted only.
- No database schema changes, backend APIs, external AI APIs, external content fetches, or new third-party service dependencies are expected.
