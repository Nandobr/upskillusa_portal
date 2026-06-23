## Context

The portal already has a client-side EN/ES/PT toggle backed by `LanguageProvider` and copy objects in `content.ts`, `plan.ts`, and `portal-pages.tsx`. That toggle updates many labels immediately, but the choice is not persisted, the document `<html lang>` remains English, some high-visibility flows still use hardcoded English, and AI-generated report values do not follow the selected language.

The goal is to finish MVP localization without turning the app into a route-localized, translation-platform-backed product. The current portal is an unauthenticated public MVP with local plan persistence and server API routes for AI reports, so the simplest durable approach is to extend the existing copy-table pattern and pass language context where needed.

## Goals / Non-Goals

**Goals:**

- Persist the visitor's selected language locally.
- Update the browser document language to match EN, ES, or Brazilian Portuguese.
- Use Brazilian Portuguese as the PT variant for all review and generation instructions.
- Ensure user-facing AI report values follow the selected language while internal JSON keys remain stable English contracts.
- Inventory remaining hardcoded English and migrate user-facing portal copy into existing language-aware copy structures.
- Add a small QA script that catches common localization mistakes before browser testing.
- Verify primary pages and print/PDF report flows in EN, ES, and PT-BR.

**Non-Goals:**

- No new i18n library.
- No URL locale routing such as `/es` or `/pt-br`.
- No server-side locale negotiation.
- No full translation of the occupation dataset, BLS/O*NET content, third-party tool names, or generated internal IDs.
- No change to saved plan storage schema beyond using the selected language at render/export time.

## Decisions

### Keep the existing client-side language provider

Extend `LanguageProvider` with local persistence and document language updates instead of replacing it with an i18n framework.

- Rationale: the app already centralizes most page copy through `usePortalContent()` and `getPlanCopy(language)`, and a client-side toggle is enough for the MVP.
- Alternative considered: introduce `next-intl` or route-based locales. That would improve SEO and server-rendered language metadata, but it adds routing, middleware, and copy-file migration complexity before the content is stable.

### Persist language in localStorage

Store the selected language under a small versioned key such as `upskillusa.language.v1`.

- Rationale: it matches the app's existing local-only plan persistence and fixes the refresh reset without backend state.
- Alternative considered: use cookies. Cookies could help server-render `<html lang>`, but the current app shell is client-driven and does not need request-time locale resolution yet.

### Update `<html lang>` from the client

When the language changes, set `document.documentElement.lang` to `en`, `es`, or `pt-BR`.

- Rationale: this gives accessibility tools and browser translation features a better signal without route-level locales.
- Alternative considered: keep static `lang="en"`. That is simpler but inaccurate when visitors use ES or PT.

### Treat PT as Brazilian Portuguese

Keep the visible toggle label as `PT` unless design changes later, but interpret it as PT-BR in copy review, `html lang`, AI prompts, and QA naming.

- Rationale: the target user context and current copy are Brazilian Portuguese-oriented.
- Alternative considered: rename the toggle to `PT-BR`. That is clearer but may be too wide for the compact header; it can be revisited after mobile testing.

### Keep JSON keys English and translate values

API requests should include the selected language. Gemini prompts should instruct the model to return user-facing string values in the selected language while preserving schema keys, enum values, numeric fields, and internal identifiers in English.

- Rationale: stable keys keep parsing and rendering predictable, while translated values make reports useful to visitors.
- Alternative considered: translate keys and enums too. That would break existing schemas, report normalization, and saved plan compatibility.

### Use a translation inventory before broad edits

Create an inventory of hardcoded user-facing strings before moving copy. Categorize strings as UI copy, generated/PDF copy, API prompt/report value copy, data labels, or intentionally untranslated proper nouns/tool names.

- Rationale: this minimizes missed strings and avoids translating code constants or data that should remain stable.
- Alternative considered: manually patch pages ad hoc. Faster at first, but it tends to miss secondary states, PDFs, errors, and mobile labels.

### Keep homepage-specific copy language-complete

Homepage copy that overrides shared framework content should require entries for English, Spanish, and Brazilian Portuguese instead of using a partial fallback object.

- Rationale: the overview is a high-visibility entry point, and fallback to older shared framework copy can make translated homepage cards diverge from the current English positioning.
- Alternative considered: rely on shared framework translations when a homepage override is missing. That avoids duplicating copy, but it hides semantic drift from localization QA and TypeScript.

### Add a lightweight QA script

The QA script should check copy object key parity, empty strings, placeholder consistency, and likely English leftovers in ES/PT-BR copy. It should be conservative and allow documented exceptions.

- Rationale: simple automated checks catch the common mistakes without introducing a translation management system.
- Alternative considered: rely only on browser review. Human review is still needed for tone, but automation catches structural mistakes cheaply.

## Risks / Trade-offs

- Client-side language hydration may briefly show English before the stored language loads -> Keep the provider simple and update state as early as possible; avoid complex blocking UI unless flicker becomes visible.
- Hardcoded string inventory may include false positives from class names, API URLs, and code constants -> Categorize findings and only migrate user-facing strings.
- AI output may mix languages or leave product/tool names in English -> Prompt explicitly for selected language while allowing proper nouns and tool names to remain unchanged.
- Generated reports saved in one language may later render under another selected language with mixed content -> Prefer translating generated report values at generation time and translating surrounding labels at render time; note that old saved generated text may remain in the original language.
- PT toggle may be ambiguous between Portugal and Brazil -> Treat `pt` internally as PT-BR and use `pt-BR` for document language and AI instructions.
- Occupation dataset remains English -> Leave dataset translation out of scope and document the fallback so the IKIGAI assessment can still be improved without a massive data project.

## Migration Plan

1. Add persistence and document language behavior to the provider.
2. Add language to report API requests and prompts.
3. Build the translation inventory and migrate hardcoded UI strings in priority order.
4. Add localization QA script and wire it into package scripts.
5. Browser-test EN/ES/PT across main pages, saved plan, and PDF/print flows.
6. Keep rollback simple: localStorage persistence and language-aware prompt changes can be reverted without data migration because existing saved plan data remains readable.

## Open Questions

- Should the visible toggle remain `PT` or become `PT-BR` if mobile spacing allows?
- Which hardcoded occupational dataset labels should remain English for MVP, and which summary labels need immediate translation around them?
