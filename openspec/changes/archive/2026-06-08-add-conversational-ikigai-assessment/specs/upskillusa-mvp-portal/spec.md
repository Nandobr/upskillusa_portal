## MODIFIED Requirements

### Requirement: Multilingual MVP copy
The system SHALL provide a simple client-side language toggle for English, Spanish, and Portuguese key MVP copy, with English fallback for assessment-specific copy that is not yet translated.

#### Scenario: Visitor changes language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the system updates key navigation labels, calls to action, form labels, page summaries, and demo text to the selected language where translated copy exists

#### Scenario: Visitor first opens the portal
- **WHEN** a visitor opens the portal without selecting a language
- **THEN** the system displays English copy by default

#### Scenario: Assessment translation is unavailable
- **WHEN** a visitor selects ES or PT and an assessment-specific label or prompt does not have translated copy
- **THEN** the system displays the English assessment copy instead of a missing or empty value

### Requirement: Inspire IKIGAI demo
The Inspire route SHALL replace the lightweight IKIGAI prompt demo with the full in-page Conversational IKIGAI Assessment while preserving the existing Step 1 Inspiration title, route, navigation label, and role as the emotional, self-discovery entry point to the portal.

#### Scenario: Visitor starts Inspiration assessment
- **WHEN** a visitor opens the Inspire route
- **THEN** the system keeps the existing Step 1 Inspiration page identity and displays pathway choices for the Conversational IKIGAI Assessment instead of the previous lightweight profile form

#### Scenario: Visitor progresses through assessment
- **WHEN** a visitor completes assessment steps
- **THEN** the system reveals subsequent assessment sections below on the same page rather than opening a modal or navigating away

#### Scenario: Visitor completes assessment
- **WHEN** a visitor completes the assessment results or comparison step
- **THEN** the system displays ranked occupation matches, comparison options, and a local personalized action plan using the visitor's responses

#### Scenario: Visitor has not completed assessment
- **WHEN** a visitor opens the Inspire route before entering responses
- **THEN** the system displays guided assessment entry points and an empty or start state that does not imply a result has been generated

#### Scenario: Visitor wants to view the plan so far
- **WHEN** a visitor activates the View plan so far action from Inspire after saving assessment progress or results
- **THEN** the system routes the visitor to `/plan` and displays the saved assessment result as part of the plan
