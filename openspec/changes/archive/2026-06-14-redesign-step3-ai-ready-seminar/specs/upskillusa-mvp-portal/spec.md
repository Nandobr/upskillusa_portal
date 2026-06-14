## ADDED Requirements

### Requirement: AI-Ready Action Plan visible naming
The system SHALL use **AI-Ready Action Plan** as the visible name for saved plan surfaces and Step 3 plan actions where the previous MVP referred to the visitor's AI Upgrade Plan.

#### Scenario: Visitor views plan-related actions
- **WHEN** a visitor views Step 3 result actions or plan navigation labels
- **THEN** the system displays AI-Ready Action Plan terminology instead of AI Upgrade Plan terminology where appropriate

#### Scenario: Visitor opens the plan route
- **WHEN** a visitor navigates to `/plan`
- **THEN** the system presents the saved portal output as an AI-Ready Action Plan while keeping the `/plan` route available

## MODIFIED Requirements

### Requirement: Sequential navigation
The system SHALL present the framework navigation in the sequence Inspire, Learn, Seminar, Implement across the portal.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Inspire, Learn, Seminar, and Implement in order

#### Scenario: Visitor views mobile navigation
- **WHEN** a visitor views any portal route on a mobile viewport
- **THEN** the system provides accessible navigation to all four framework routes

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
