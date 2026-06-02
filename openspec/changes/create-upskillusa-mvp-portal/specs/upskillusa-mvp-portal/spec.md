## ADDED Requirements

### Requirement: Public portal routes
The system SHALL provide a public, unauthenticated UpSkill USA portal with separate routes for the overview and the four-framework sequence.

#### Scenario: Visitor opens the portal overview
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays an overview of the UpSkill USA four-framework journey and links to Inspire, Learn, Adapt, and Implement

#### Scenario: Visitor opens each framework route
- **WHEN** a visitor navigates to `/inspire`, `/learn`, `/adapt`, or `/implement`
- **THEN** the system displays the corresponding framework page without requiring sign-in

### Requirement: Sequential navigation
The system SHALL present the framework navigation in the sequence Inspire, Learn, Adapt, Implement across the portal.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Inspire, Learn, Adapt, and Implement in order

#### Scenario: Visitor views mobile navigation
- **WHEN** a visitor views any portal route on a mobile viewport
- **THEN** the system provides accessible navigation to all four framework routes

### Requirement: Multilingual MVP copy
The system SHALL provide a simple client-side language toggle for English, Spanish, and Portuguese key MVP copy.

#### Scenario: Visitor changes language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the system updates key navigation labels, calls to action, form labels, page summaries, and demo text to the selected language

#### Scenario: Visitor first opens the portal
- **WHEN** a visitor opens the portal without selecting a language
- **THEN** the system displays English copy by default

### Requirement: Inspire IKIGAI demo
The Inspire route SHALL include an IKIGAI self-discovery demo using the four prompt categories from the source DOCX.

#### Scenario: Visitor completes IKIGAI prompts
- **WHEN** a visitor enters responses for what they love, what they are good at, what the world needs, and what they can be paid for
- **THEN** the system displays a client-side draft purpose statement using those responses

#### Scenario: Visitor has not completed prompts
- **WHEN** a visitor opens the Inspire route before entering responses
- **THEN** the system displays the four guided prompt areas and a disabled or empty result state

### Requirement: Learn resource hub
The Learn route SHALL present concise DOCX-derived learning content for community colleges, public learning, AI tools, and custom GPT preparation.

#### Scenario: Visitor opens Learn
- **WHEN** a visitor navigates to `/learn`
- **THEN** the system displays learning sections for the formal college channel, public learning channel, AI tool library, and custom GPT or role-preparation concept

### Requirement: Adapt seminar and five-year plan demo
The Adapt route SHALL include a static seminar interest experience and a simple client-side five-year plan builder.

#### Scenario: Visitor submits seminar interest
- **WHEN** a visitor enters seminar interest details
- **THEN** the system displays a local confirmation state without sending data to a backend

#### Scenario: Visitor builds a five-year plan
- **WHEN** a visitor enters plan inputs such as role, automation opportunity, augmentation opportunity, ownership goal, and future skill
- **THEN** the system displays a draft five-year plan summary using those inputs

### Requirement: Implement mock audit and workflow demo
The Implement route SHALL include a clearly labeled mock company audit and bottom-up workflow-builder demo inspired by the Lovable reference app.

#### Scenario: Visitor enters a company URL
- **WHEN** a visitor enters a company URL in the Implement demo
- **THEN** the system displays sample audit findings labeled as demo or mock content

#### Scenario: Visitor configures a workflow
- **WHEN** a visitor selects or enters workflow details
- **THEN** the system displays a draft workflow summary with human review gates and sample ROI or hours-saved values labeled as demo content

### Requirement: Local design-system guidance
The implementation SHALL add `DESIGN.md` documenting the MVP visual system and UI rules.

#### Scenario: Developer reviews design guidance
- **WHEN** a developer opens `DESIGN.md`
- **THEN** the file documents the Lovable-inspired palette, typography direction, layout patterns, component style, responsive expectations, and demo-content labeling rules

### Requirement: Local logo asset
The implementation SHALL include the UpSkill USA logo asset locally when it can be extracted from the Lovable reference app.

#### Scenario: Logo asset is available
- **WHEN** the Lovable logo asset can be downloaded during implementation
- **THEN** the system stores and renders the logo from a local project asset path

#### Scenario: Logo asset cannot be downloaded
- **WHEN** the Lovable logo asset cannot be downloaded during implementation
- **THEN** the system uses a text-based UpSkill USA brand mark and records the asset as a remaining follow-up

### Requirement: Verification scripts
The implementation SHALL include package scripts that support local development, linting, type checking, and production build verification.

#### Scenario: Developer verifies the MVP
- **WHEN** a developer runs the relevant verification scripts
- **THEN** lint, type checking, and production build commands complete or report actionable failures
