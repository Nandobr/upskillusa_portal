## 1. Language State And Metadata

- [x] 1.1 Add a versioned localStorage key and safe language parsing helper for `en`, `es`, and `pt`.
- [x] 1.2 Update `LanguageProvider` to hydrate from localStorage after mount and persist changes when the visitor selects a language.
- [x] 1.3 Update `LanguageProvider` to set `document.documentElement.lang` to `en`, `es`, or `pt-BR` when language changes.
- [x] 1.4 Verify the EN/ES/PT toggle survives refresh and does not break initial English rendering.

## 2. Translation Inventory And Copy Structure

- [x] 2.1 Create a translation inventory of user-facing hardcoded strings across `content.ts`, `plan.ts`, `portal-pages.tsx`, `ikigai-assessment.tsx`, API error text, and PDF/print labels.
- [x] 2.2 Categorize inventory findings as translated copy, hardcoded UI copy, generated report copy, dataset/proper-noun exceptions, or internal-only constants.
- [x] 2.3 Move high-priority hardcoded portal UI strings into existing language-aware copy objects without adding a new i18n framework.
- [x] 2.4 Update copy naming/comments so `pt` is documented as Brazilian Portuguese / PT-BR.

## 3. Page And Plan Localization

- [x] 3.1 Localize remaining high-visibility Learn, Seminar, Implement, Opportunity, and Plan labels/actions/errors that are currently hardcoded English.
- [ ] 3.2 Localize IKIGAI assessment headings, prompts, buttons, empty states, review labels, and action-plan labels while keeping occupation dataset values in English for this MVP.
- [x] 3.3 Localize generated AI-Ready Action Plan surrounding labels and text helpers in copy/download/print flows.
- [x] 3.4 Preserve English fallback behavior for untranslated assessment or dataset values so no missing or empty labels appear.
- [x] 3.5 Localize homepage-specific framework card question, summary, and CTA copy in EN, ES, and PT-BR, and require language-complete card copy so missing translations do not silently fall back.

## 4. AI Report Language Support

- [x] 4.1 Include the selected language in Business Leader and Employee report API request payloads.
- [x] 4.2 Update Business Leader Gemini audit prompts to request user-facing generated values in English, Spanish, or Brazilian Portuguese while preserving JSON keys/schema.
- [x] 4.3 Update Employee Gemini task-analysis prompts to request user-facing generated values in English, Spanish, or Brazilian Portuguese while preserving JSON keys/enums/schema.
- [ ] 4.4 Verify generated report labels and saved-plan render labels remain stable when a report generated in one language is viewed under another selected language.

## 5. Localization QA

- [x] 5.1 Add a lightweight localization QA script that checks copy object key parity, empty strings, placeholder consistency, and likely untranslated ES/PT-BR strings.
- [x] 5.2 Add a package script for the localization QA command.
- [x] 5.3 Document intentional exceptions such as proper nouns, AI tool names, route labels, occupation dataset values, and internal enum values.

## 6. Verification

- [x] 6.1 Run `openspec validate --all`.
- [x] 6.2 Run `npm run typecheck`, `npm run lint`, `npm run build`, and the localization QA script.
- [x] 6.3 Browser-test desktop and mobile header language switching, refresh persistence, and document language changes.
- [ ] 6.4 Browser-test `/`, `/inspire`, `/learn`, `/adapt`, `/implement`, `/opportunity`, and `/plan` in EN, ES, and PT-BR.
- [ ] 6.5 Browser-test Business Leader and Employee AI reports in ES and PT-BR, including visible errors and saved plan output.
- [ ] 6.6 Browser-test print/PDF flows for Learn, Seminar, Implement reports, and final Plan in EN, ES, and PT-BR.
