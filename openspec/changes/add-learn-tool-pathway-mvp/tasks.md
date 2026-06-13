## 1. Learn Pathway Data

- [x] 1.1 Define static Learn pathway configuration for group, starting point, goal, tool, format, and time options
- [x] 1.2 Define deterministic mapping from selected goals to general LLM or document-heavy tool option sets
- [x] 1.3 Define deterministic LEARN Report content fragments for profile summary, learning path, tool starter guide, practice prompt, and next action
- [x] 1.4 Add or update TypeScript types for the new Learn pathway selections and saved plan fields

## 2. Learn Pathway UI

- [x] 2.1 Replace the current Learn demo with a cascading selectable pathway UI on `/learn`
- [x] 2.2 Implement downstream reset behavior when an earlier selection changes
- [x] 2.3 Render the generated LEARN Report only after all required selections are complete
- [x] 2.4 Add copy and download actions for the generated LEARN Report
- [x] 2.5 Ensure Learn pathway layout follows `DESIGN.md` and the Step 1 selectable-card visual pattern

## 3. AI Upgrade Plan Integration

- [x] 3.1 Save selected group, starting point, goal, tool, format, time, report summary, and recommended next action to local plan state
- [x] 3.2 Treat saving the LEARN Report as completing Step 2 in plan progress
- [x] 3.3 Keep the visitor on `/learn` after saving and show a saved confirmation state
- [x] 3.4 Update `/plan` Learn output copy to reflect the new pathway fields

## 4. Verification

- [x] 4.1 Verify all selectable pathways use selectable controls only and no free-text questions
- [x] 4.2 Verify Gemini appears in general LLM/tool option sets
- [x] 4.3 Verify report copy/download actions work and Learn save does not automatically navigate to Adapt
- [x] 4.4 Run lint, type check, and production build verification commands
