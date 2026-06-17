## MODIFIED Requirements

### Requirement: Multilingual MVP copy
The system SHALL provide a client-side language toggle for English, Spanish, and Brazilian Portuguese MVP copy, persist the selected language locally, update the document language metadata, and use the selected language for user-facing generated report values where language-aware generation is available.

#### Scenario: Visitor changes language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the system updates key navigation labels, calls to action, form labels, page summaries, demo text, generated-plan labels, and report shell labels to the selected language where translated copy exists
- **AND** the system stores the selected language for future visits in the same browser

#### Scenario: Visitor returns after selecting a language
- **WHEN** a visitor has previously selected ES or PT and opens or refreshes the portal
- **THEN** the system restores the previously selected language instead of resetting to English

#### Scenario: Visitor first opens the portal
- **WHEN** a visitor opens the portal without a stored language selection
- **THEN** the system displays English copy by default

#### Scenario: Document language reflects selected language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the system sets the document language to `en`, `es`, or `pt-BR` respectively

#### Scenario: Assessment translation is unavailable
- **WHEN** a visitor selects ES or PT and an assessment-specific label, occupation dataset value, or prompt does not have translated copy
- **THEN** the system displays English fallback copy instead of a missing or empty value

#### Scenario: AI report follows selected language
- **WHEN** a visitor generates a Business Leader or Employee AI report while ES or PT is selected
- **THEN** the system requests user-facing generated report values in Spanish or Brazilian Portuguese respectively
- **AND** the system preserves English JSON keys, enum values, numeric fields, and internal identifiers required by existing report parsing

#### Scenario: Saved plan renders in selected language
- **WHEN** a visitor opens, copies, downloads, or prints the AI-Ready Action Plan
- **THEN** the system renders surrounding plan labels, actions, and generated plan text in the currently selected language where translated copy exists

## ADDED Requirements

### Requirement: Localization quality checks
The implementation SHALL include lightweight localization QA checks that help prevent missing or inconsistent translations before browser verification.

#### Scenario: Developer runs localization QA
- **WHEN** a developer runs the localization QA command
- **THEN** the system checks language copy structures for missing keys, empty user-facing strings, placeholder mismatches, and likely untranslated ES/PT-BR strings
- **AND** the command reports actionable failures without requiring a translation service or external API

#### Scenario: Developer reviews translation inventory
- **WHEN** the localization inventory is generated or updated
- **THEN** the system categorizes strings that need translation, strings already covered by language-aware copy, generated-report strings, and intentional English exceptions such as proper nouns, tool names, and dataset values
