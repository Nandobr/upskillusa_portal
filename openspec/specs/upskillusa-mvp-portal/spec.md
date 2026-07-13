# upskillusa-mvp-portal Specification

## Purpose
Define the public UpSkill USA MVP portal experience: a multilingual, unauthenticated Next.js portal that guides visitors through Imagine, Learn, Adapt, and Implement with client-side demo flows and Lovable-inspired visual design.
## Requirements
### Requirement: Public portal routes
The system SHALL provide a public, unauthenticated UpSkill USA portal with separate routes for the overview and the four-framework sequence.

#### Scenario: Visitor opens the portal overview
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays an overview of the UpSkill USA four-framework journey and links to Imagine, Learn, Adapt, and Implement

#### Scenario: Visitor reviews the overview framework cards
- **WHEN** a visitor views the overview framework cards
- **THEN** each card presents the framework icon centered above the step label, centered title and descriptive copy, and a clear call to action for the corresponding framework route

#### Scenario: Visitor opens each framework route
- **WHEN** a visitor navigates to `/inspire`, `/learn`, `/adapt`, or `/implement`
- **THEN** the system displays the corresponding framework page without requiring sign-in

### Requirement: Sequential navigation
The system SHALL present the framework navigation in the sequence Imagine, Learn, Seminar, Implement across the portal.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Imagine, Learn, Seminar, and Implement in order

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

### Requirement: Imagine IKIGAI demo
The `/inspire` route SHALL replace the lightweight IKIGAI prompt demo with the full in-page Conversational IKIGAI Assessment while preserving the existing Step 1 Imagine title, route, navigation label, and role as the emotional, self-discovery entry point to the portal.

#### Scenario: Visitor starts Imagine assessment
- **WHEN** a visitor opens the `/inspire` route
- **THEN** the system keeps the existing Step 1 Imagine page identity and displays pathway choices for the Conversational IKIGAI Assessment instead of the previous lightweight profile form

#### Scenario: Visitor progresses through assessment
- **WHEN** a visitor completes assessment steps
- **THEN** the system reveals subsequent assessment sections below on the same page rather than opening a modal or navigating away

#### Scenario: Visitor completes assessment
- **WHEN** a visitor completes the assessment results or comparison step
- **THEN** the system displays ranked occupation matches, comparison options, and a local personalized action plan using the visitor's responses

#### Scenario: Visitor has not completed assessment
- **WHEN** a visitor opens the `/inspire` route before entering responses
- **THEN** the system displays guided assessment entry points and an empty or start state that does not imply a result has been generated

#### Scenario: Visitor wants to view the plan so far
- **WHEN** a visitor activates the View plan so far action from Imagine after saving assessment progress or results
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

### Requirement: Learn Course Recommendations
The Learn route SHALL add four trusted free or free-to-audit AI course recommendations to the generated LEARN report based on the visitor's selected learner group, practical goal, AI tool, preferred format, and current language.

#### Scenario: Visitor completes the Learn pathway
- **WHEN** a visitor selects a learner group, practical goal, AI tool, and learning format on `/learn`
- **THEN** the generated LEARN report displays four recommended course cards labeled Understand AI, Learn your tool, Use AI in your role, and Use AI responsibly
- **AND** each card includes course title, provider, level, access model, language metadata, a short fit reason, and a direct course link

#### Scenario: Recommendations use the course catalog
- **WHEN** the system generates Learn course recommendations
- **THEN** it selects courses from the repo-owned AI course catalog derived from the deduped course CSV
- **AND** it does not require a database, authentication, external recommendation API, or runtime access to a local Downloads file

#### Scenario: Recommendations match the selected tool
- **WHEN** a visitor selects ChatGPT, Claude, Gemini, Copilot, or NotebookLM as the Learn tool
- **THEN** the Learn your tool recommendation prioritizes courses whose title, provider, topic, or fit reason match the selected tool or its provider family
- **AND** NotebookLM recommendations may use Google/Gemini practical learning courses when no stronger NotebookLM-specific course is available

#### Scenario: Educator receives practical tool learning
- **WHEN** an educator completes the Learn pathway
- **THEN** the Learn your tool recommendation prioritizes practical ChatGPT, NotebookLM, Gemini, Copilot, or Claude fluency
- **AND** the Use AI in your role recommendation prioritizes education, teaching-material, feedback, student-guidance, or responsible classroom-use courses

#### Scenario: Recommendations form a simple learning sequence
- **WHEN** the system chooses the four course cards
- **THEN** Understand AI prioritizes beginner AI literacy or generative AI foundations
- **AND** Learn your tool prioritizes practical selected-tool fluency
- **AND** Use AI in your role prioritizes the selected learner group and practical goal
- **AND** Use AI responsibly prioritizes ethics, privacy, safety, governance, human review, or responsible AI

#### Scenario: Course recommendations fit mobile layouts
- **WHEN** a visitor views the generated LEARN report on a smartphone-width viewport
- **THEN** the four course recommendation cards stack vertically with readable metadata, fit reason, and course links without horizontal scrolling

#### Scenario: Course metadata is incomplete
- **WHEN** a selected course has missing source metadata
- **THEN** the system displays available fields without inventing missing factual details
- **AND** the recommendation still provides a fit reason based on catalog fields that are available

### Requirement: Homepage AI Opportunity Report launcher
The overview route SHALL present a URL-only launcher in the existing homepage hero that hands the visitor into the canonical Implement business-leader audit without generating or rendering an audit on the homepage.

#### Scenario: Visitor views the homepage hero launcher
- **WHEN** a visitor navigates to `/`
- **THEN** the existing homepage eyebrow, headline, and introduction remain visible
- **AND** the hero displays a labeled company URL input, the English CTA `Get your free AI Opportunity Report` or its selected-language equivalent, and a Watch Demo link to `/demo`
- **AND** the hero does not display a trust-claim row or the claims `30-second audit` and `Enterprise-grade security`

#### Scenario: Visitor submits a valid company URL
- **WHEN** a visitor submits a valid company URL from the homepage hero
- **THEN** the system stores a fresh Implement draft with Business Leader selected and the trimmed company URL prefilled
- **AND** it clears the Implement email, report, selected pilot, saved timestamp, workflow, guardrail, and employee-selection state to their defaults
- **AND** it preserves Inspire, Learn, and Adapt draft data
- **AND** it navigates to `/implement` without requesting `/api/analyze-business-opportunity`

#### Scenario: Visitor submits an invalid company URL
- **WHEN** a visitor submits an empty or invalid company URL from the homepage hero
- **THEN** the visitor remains on `/`
- **AND** the system displays a localized accessible validation error
- **AND** it does not update the Implement draft or request the audit API

#### Scenario: Visitor continues the audit in Implement
- **WHEN** the visitor arrives at `/implement` through the homepage launcher
- **THEN** the Business Leader path is selected and the submitted company URL is prefilled
- **AND** the report contact email is empty and required before generation
- **AND** only the existing Implement submission requests the audit API
- **AND** the existing Implement business opportunity report renders the response without a homepage-specific report variant

#### Scenario: Visitor watches the demo
- **WHEN** a visitor activates Watch Demo from the homepage hero
- **THEN** the system navigates to `/demo` without altering the Implement draft or requesting the audit API

### Requirement: Homepage journey preservation
The overview route SHALL keep the existing four-framework journey directly below the redesigned hero.

#### Scenario: Visitor views content below the hero
- **WHEN** a visitor views the homepage below the hero launcher
- **THEN** the existing overview heading remains visible
- **AND** exactly four framework cards remain in the existing Imagine, Learn, Seminar, and Implement order
- **AND** the former user-facing `Inspire` label is renamed to `Imagine` while its `/inspire` route and behavior remain unchanged

### Requirement: Localized and responsive homepage launcher
The homepage launcher SHALL provide equivalent English, Spanish, and Brazilian Portuguese behavior and SHALL remain accessible and usable across supported viewport widths.

#### Scenario: Visitor changes language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the URL label, placeholder, validation error, CTA, and Watch Demo label use the selected language
- **AND** the English CTA remains exactly `Get your free AI Opportunity Report`

#### Scenario: Visitor uses keyboard or assistive technology
- **WHEN** a visitor operates the launcher without a pointer
- **THEN** the URL input has a programmatic label, URL autocomplete/input semantics, visible focus, and Enter-key submission
- **AND** validation feedback is announced as an alert
- **AND** decorative icons are hidden from assistive technology

#### Scenario: Visitor uses a narrow viewport
- **WHEN** a visitor views the homepage at smartphone width
- **THEN** the URL input, CTA, Watch Demo action, and four framework cards stack without clipped text or horizontal scrolling
- **AND** interactive controls remain at least 44 pixels high

#### Scenario: Visitor views the desktop header and launcher
- **WHEN** a visitor views the homepage at desktop width
- **THEN** the URL launcher uses a compact centered width with input and CTA controls no shorter than 44 pixels
- **AND** the primary header navigation labels use a larger readable font without colliding or wrapping
- **AND** the homepage Watch Demo button is approximately 30 percent shorter than its previous 48-pixel presentation
- **AND** the homepage hero headline uses a balanced scale that does not overpower the launcher or alter other page headings

### Requirement: Homepage audit retirement and data cleanup
The overview route SHALL no longer collect email, generate, render, or persist a homepage-specific audit report and SHALL remove legacy homepage report data when possible.

#### Scenario: Homepage loads with legacy audit data
- **WHEN** browser storage contains `upskillusa.homepageAuditReport.v1` or `upskillusa.homepageAuditReport.v2`
- **THEN** the homepage removes both legacy entries on a best-effort basis
- **AND** it does not hydrate or display the stored report or contact email

#### Scenario: Browser storage cleanup is unavailable
- **WHEN** browser privacy settings prevent access to local storage
- **THEN** the homepage hero remains usable and does not crash

#### Scenario: Homepage source and styles are retired
- **WHEN** the launcher replaces the prior homepage audit section
- **THEN** homepage-specific audit form, report, persistence, and loading/error rendering code is no longer active
- **AND** no `.homepage-audit` or `.homepage-audit-*` selector remains in the application styles
- **AND** shared Implement report code and `.business-audit-*` styles remain available
