# Localization Inventory

## Translated Copy Structures

- `src/lib/content.ts`: portal navigation, hero/page copy, framework summaries, demo notes, shared UI labels. The `pt` language code intentionally maps to Brazilian Portuguese / `pt-BR`.
- `src/lib/plan.ts`: AI-Ready Action Plan labels, feedback, plan text helpers, Learn option/report helpers, and next-action copy.
- `src/components/portal-pages.tsx`: Learn demo labels and localized Opportunity page copy.
- `src/lib/implementation-lab-copy.ts`: Implement lab labels, loading states, report chrome, form errors, and PDF/action labels.

## Hardcoded UI Copy Still Accepted For MVP

- `src/components/ikigai-assessment.tsx`: high-volume assessment text and occupation comparison labels are not fully localized in this change.
- `src/lib/ikigai-assessment.ts`: pathway, skill, interest, recommendation, and occupation-adjacent guidance remains English for this MVP.
- Imported occupation dataset values in `src/lib/data/occupations*` remain English.

## Generated Report Copy

- Business Leader Gemini prompts request user-facing string values in English, Spanish, or Brazilian Portuguese while preserving JSON keys and schema.
- Employee Gemini task-analysis prompts request user-facing string values in English, Spanish, or Brazilian Portuguese while preserving JSON keys, enum values, and schema.
- Learn reports are generated locally from language-aware option/report helpers.
- Final Plan copy/download/print output is generated through `getPlanCopy(language)` and `planToText(plan, language)`.

## Dataset, Proper-Noun, And Internal Exceptions

- Proper nouns and product names stay unchanged: UpSkill USA, LEARN, ChatGPT, Claude, Gemini, Microsoft Copilot, NotebookLM, O*NET, Bureau of Labor Statistics, CareerOneStop.
- URLs, route paths, env var names, API keys, storage keys, IDs, and internal enum values stay English/stable.
- Report JSON keys and bucket enum values (`AUTOMATE`, `AUGMENT`, `OWN`) stay English for schema compatibility.
- Company names, domains, work-area names, and live API data are displayed as returned.

## Follow-Up Candidates

- Localize the full IKIGAI assessment dataset and comparison table.
- Localize work-area/task taxonomy values used by the Implement report selector.
- Add richer locale-aware number/date/currency formatting if the MVP expands beyond US-centered reporting.
