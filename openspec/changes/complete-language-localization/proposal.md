## Why

The current language toggle changes much of the portal copy live, but it resets on refresh, leaves some high-visibility UI in English, keeps `<html lang>` fixed to English, and does not guide AI-generated reports to match the selected language. This change completes the MVP localization behavior without adding route-based locales or a full i18n framework.

## What Changes

- Persist the selected language across page refreshes and browser sessions.
- Treat Portuguese as Brazilian Portuguese for copy, AI prompts, and review expectations.
- Update the document language metadata when visitors select English, Spanish, or Brazilian Portuguese.
- Make AI-generated report values follow the selected language while preserving English JSON keys and internal data contracts.
- Inventory hardcoded English strings and move user-facing UI/report/PDF strings into the existing copy structures.
- Add lightweight localization QA checks for missing keys, mismatched placeholders, empty strings, and obvious untranslated strings.
- Browser-test the main portal routes and print/PDF flows in EN, ES, and PT-BR.
- Avoid adding a new i18n library, URL locale routing, or full occupation dataset translation in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Extend the existing portal language toggle into a persistent, page-wide MVP localization system that also controls generated report language.

## Impact

- `src/components/language-provider.tsx`: persist selection, hydrate safely, update document language.
- `src/components/app-shell.tsx`: keep the existing EN/ES/PT toggle and reflect persisted state.
- `src/lib/content.ts`, `src/lib/plan.ts`, `src/components/portal-pages.tsx`, `src/components/ikigai-assessment.tsx`: move remaining user-facing hardcoded strings into language-aware copy objects.
- `src/app/api/analyze-business-opportunity/route.ts`, `src/app/api/analyze-employee-tasks/route.ts`, `src/lib/business-audit-services.ts`: accept selected language context and instruct Gemini to return user-facing values in that language.
- Scripts/tests: add a lightweight localization QA script and run browser checks for EN/ES/PT-BR across the primary flows.
