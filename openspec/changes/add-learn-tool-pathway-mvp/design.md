## Context

The portal already presents the four-framework journey and has a shared framework page implementation for `/learn`. The current Learn experience is mostly explanatory content, while Step 1 now demonstrates a richer guided assessment pattern with selectable choices, generated results, and local AI Upgrade Plan persistence.

This change replaces the Learn demo with a product-prototype pathway for common AI tool learning. The pathway must stay broad enough for students, educators, workers, and entrepreneurs while avoiding the content explosion of departments, disciplines, job categories, or industries.

## Goals / Non-Goals

**Goals:**
- Replace the current `/learn` demo with a cascading selectable pathway.
- Use the existing Step 1 visual language: cards, chips, progressive sections, selected states, result preview, and save-to-plan action.
- Support four broad user groups: Student, Educator, Worker, and Entrepreneur.
- Personalize the generated LEARN Report through simple deterministic rules, not AI generation.
- Provide copy/download actions for the LEARN Report.
- Use internal demo report content only.
- Mark Learn complete in the local AI Upgrade Plan when the visitor saves the generated pathway.
- Keep the visitor on the Learn page after saving instead of automatically advancing to Adapt.

**Non-Goals:**
- No open-ended questions or chatbot routing.
- No discipline, department, job-category, business-area, or industry branching.
- No external video/link curation or separate clickable asset library for this MVP.
- No backend persistence, authentication, database changes, AI API calls, or CMS.
- No community boards, contributor pipeline, ranking brain, or live ingestion engine.

## Decisions

### Use a configuration-driven pathway

Define the Learn pathway as static configuration: groups, goals, tool options, learning formats, internal default starting point/time values, and report content fragments.

- Rationale: keeps the MVP easy to inspect, modify, and test.
- Alternative considered: hard-code each step directly into JSX. That would be faster initially but harder to maintain as options change.

### Use broad user groups as light personalization only

The first filter changes wording and goal options for Student, Educator, Worker, and Entrepreneur, but it does not create separate content systems.

- Rationale: gives the experience a human entry point without creating a giant content matrix.
- Alternative considered: begin with AI knowledge level only. That is simpler but loses the useful "who is this for?" framing from the original LEARN roadmap.

### Keep cascading options small

Use three options for most steps. Use four tool options for general LLM/tool selection when needed to include ChatGPT, Claude, Gemini, and Microsoft Copilot.

- Rationale: small choice sets make the prototype understandable and avoid overwhelming visitors.
- Alternative considered: five or more options per step. That better reflects the long-term roadmap but is too large for the MVP.

### Generate a compact LEARN Report

The result should show a report-style output with the selected path, a recommended learning path, a tool starter guide, one practice prompt, one next action, copy and PDF-download actions, and a save-to-plan action.

- Rationale: this proves the value of curation without requiring a full learning library or asset click-through system. The PDF flow keeps the selected learning options visible in the artifact.
- Alternative considered: a larger shelf with videos, guides, prompts, detail pages, and downloadable files. That can follow after the MVP proves the report interaction.

### Reuse local AI Upgrade Plan persistence

Saving the LEARN Report should populate the existing Learn portion of the plan draft using deterministic fields and mark Step 2 complete.

- Rationale: this keeps Learn integrated with the portal journey.
- Alternative considered: store pathway state separately. That would duplicate state and make `/plan` less coherent.

## Risks / Trade-offs

- Internal report content may feel less rich than real curated resources -> Label the report as demo content and make the recommendations practical enough to show value.
- Broad user groups may not feel deeply personalized -> Use group-specific goal labels and shelf copy while keeping the underlying asset set shared.
- Replacing the current Learn demo may remove explanatory roadmap content -> Keep concise surrounding Learn page copy, but make the pathway the primary demo.
- Save-to-plan behavior could be confused with auto-advancing -> Show a clear saved state and leave the next-step CTA separate from the save action.
