# upskillusa-mvp-portal Specification

## Purpose
Define the public UpSkill USA MVP portal experience: a multilingual, unauthenticated Next.js portal that guides visitors through Inspire, Learn, Adapt, and Implement with client-side demo flows and Lovable-inspired visual design.
## Requirements
### Requirement: Public portal routes
The system SHALL provide a public, unauthenticated UpSkill USA portal with separate routes for the overview and the four-framework sequence.

#### Scenario: Visitor opens the portal overview
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays an overview of the UpSkill USA four-framework journey and links to Inspire, Learn, Adapt, and Implement

#### Scenario: Visitor opens each framework route
- **WHEN** a visitor navigates to `/inspire`, `/learn`, `/adapt`, or `/implement`
- **THEN** the system displays the corresponding framework page without requiring sign-in

### Requirement: Sequential navigation
The system SHALL present the framework navigation in the sequence Inspire, Learn, Seminar, Implement across the portal.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Inspire, Learn, Seminar, and Implement in order

#### Scenario: Visitor views mobile navigation
- **WHEN** a visitor views any portal route on a mobile viewport
- **THEN** the system provides accessible navigation to all four framework routes

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

### Requirement: Learn resource hub
The Learn route SHALL present concise DOCX-derived learning content for community colleges, public learning, AI tools, and custom GPT preparation.

#### Scenario: Visitor opens Learn
- **WHEN** a visitor navigates to `/learn`
- **THEN** the system displays learning sections for the formal college channel, public learning channel, AI tool library, and custom GPT or role-preparation concept

### Requirement: Adapt seminar and action plan demo
The Adapt route SHALL present Step 3 as an AI-Ready Seminar prep builder that helps workers and business leaders prepare track-specific AI-Ready Action Plan artifacts.

#### Scenario: Visitor opens Step 3
- **WHEN** a visitor navigates to `/adapt`
- **THEN** the system displays Step 3 as the AI-Ready Seminar with a direct Build Your AI-Ready Action Plan hero and a guided prep builder

#### Scenario: Visitor chooses a seminar track
- **WHEN** a visitor selects Worker / Employee or Business Leader / Owner
- **THEN** the system presents the appropriate track-specific builder steps within the same guided panel

#### Scenario: Visitor selects seminar readiness
- **WHEN** a visitor selects a seminar readiness option
- **THEN** the system updates readiness feedback and reveals the next builder question without opening later unanswered questions

#### Scenario: Worker completes seminar prep fields
- **WHEN** a worker selects a work area from the existing portal work categories and selects the required workflow/task, weekly hours saved, hourly value, adjustable multiplier defaulting to `3.7x`, and proof point
- **THEN** the system generates a Manifest of Saved Hours with estimated annual value created

#### Scenario: Business leader completes seminar prep fields
- **WHEN** a business leader selects a business area from the existing portal work categories and selects the required workflow/problem, workers affected, weekly hours saved per worker, blended hourly value, and adjustable multiplier defaulting to `3.7x`
- **THEN** the system generates a Company AI-Ready Action Plan with estimated annual value created

#### Scenario: Visitor progresses through seminar prep questions
- **WHEN** a visitor answers each Step 3 seminar prep question
- **THEN** the system reveals only the next relevant question, uses select-button choices instead of open text or numeric fields, and keeps future unanswered questions hidden

#### Scenario: Visitor copies or downloads a generated result
- **WHEN** a visitor activates copy or download for a complete Step 3 result
- **THEN** the system provides the generated track-specific output locally without sending data to a backend

#### Scenario: Visitor saves Step 3 result
- **WHEN** a visitor saves a generated Step 3 result
- **THEN** the system stores the result in the local AI-Ready Action Plan and treats Step 3 as complete

#### Scenario: Visitor reviews the seminar day preview
- **WHEN** a visitor views the Step 3 page below the builder
- **THEN** the system displays four preview cards for Overview, Separate Tracks, Practice, and Reunion

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

### Requirement: AI-Ready Action Plan visible naming
The system SHALL use **AI-Ready Action Plan** as the visible name for saved plan surfaces and Step 3 plan actions where the previous MVP referred to the visitor's AI Upgrade Plan.

#### Scenario: Visitor views plan-related actions
- **WHEN** a visitor views Step 3 result actions or plan navigation labels
- **THEN** the system displays AI-Ready Action Plan terminology instead of AI Upgrade Plan terminology where appropriate

#### Scenario: Visitor opens the plan route
- **WHEN** a visitor navigates to `/plan`
- **THEN** the system presents the saved portal output as an AI-Ready Action Plan while keeping the `/plan` route available
