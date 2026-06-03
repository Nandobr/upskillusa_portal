## MODIFIED Requirements

### Requirement: Public portal routes
The system SHALL provide a public, unauthenticated UpSkill USA portal with separate routes for the overview, the four-framework sequence, and the AI Upgrade Plan summary.

#### Scenario: Visitor opens the portal overview
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays an overview of the UpSkill USA four-framework journey and links to Inspire, Learn, Adapt, Implement, and the AI Upgrade Plan journey

#### Scenario: Visitor opens each framework route
- **WHEN** a visitor navigates to `/inspire`, `/learn`, `/adapt`, or `/implement`
- **THEN** the system displays the corresponding framework page without requiring sign-in

#### Scenario: Visitor opens the plan route
- **WHEN** a visitor navigates to `/plan`
- **THEN** the system displays the current AI Upgrade Plan summary or an empty plan state without requiring sign-in

### Requirement: Inspire IKIGAI demo
The Inspire route SHALL include an Inspire plan input experience that preserves the IKIGAI self-discovery concept while collecting the minimum profile data needed for AI Upgrade Plan generation.

#### Scenario: Visitor completes Inspire plan inputs
- **WHEN** a visitor enters profile, role, motivation, desired outcome, and human strength inputs
- **THEN** the system displays and saves a client-side Opportunity Seed plan section using those responses

#### Scenario: Visitor has not completed Inspire inputs
- **WHEN** a visitor opens the Inspire route before entering responses
- **THEN** the system displays guided input areas and an empty result state

#### Scenario: Visitor wants to view the plan so far
- **WHEN** a visitor activates the View plan so far action from Inspire
- **THEN** the system routes the visitor to `/plan`

### Requirement: Learn resource hub
The Learn route SHALL present concise DOCX-derived learning content and collect AI readiness inputs that contribute to the AI Upgrade Plan learning path.

#### Scenario: Visitor opens Learn
- **WHEN** a visitor navigates to `/learn`
- **THEN** the system displays learning sections for the formal college channel, public learning channel, AI tool library, and custom GPT or role-preparation concept

#### Scenario: Visitor saves Learn inputs
- **WHEN** a visitor selects user track, AI comfort level, time available, and learning preference
- **THEN** the system saves those inputs locally and displays a recommended learning path preview

#### Scenario: Visitor wants to view the plan so far
- **WHEN** a visitor activates the View plan so far action from Learn
- **THEN** the system routes the visitor to `/plan`

### Requirement: Adapt seminar and action plan demo
The Adapt route SHALL include a simple client-side process mapping and action plan experience that contributes to the AI Upgrade Plan.

#### Scenario: Visitor submits seminar interest
- **WHEN** a visitor enters seminar interest details
- **THEN** the system displays a local confirmation state without sending data to a backend

#### Scenario: Visitor builds an action plan
- **WHEN** a visitor enters plan inputs such as role, automation opportunity, augmentation opportunity, ownership goal, and future skill
- **THEN** the system displays a draft action plan summary using those inputs

#### Scenario: Visitor completes process mapping inputs
- **WHEN** a visitor enters work category, workflow pain, delays, repetitive work, judgment needs, and desired outcome
- **THEN** the system saves those inputs locally and displays an AI Opportunity Draft preview

#### Scenario: Visitor wants to view the plan so far
- **WHEN** a visitor activates the View plan so far action from Adapt
- **THEN** the system routes the visitor to `/plan`

### Requirement: Implement mock audit and workflow demo
The Implement route SHALL include a clearly labeled mock implementation experience that captures pilot workflow details, human review gates, and safety checklist inputs for the complete AI Upgrade Plan.

#### Scenario: Visitor enters a company URL
- **WHEN** a visitor enters a company URL in the Implement demo
- **THEN** the system displays sample audit findings labeled as demo or mock content

#### Scenario: Visitor configures a workflow
- **WHEN** a visitor selects or enters workflow details
- **THEN** the system displays a draft workflow summary with human review gates and sample ROI or hours-saved values labeled as demo content

#### Scenario: Visitor completes safety checklist inputs
- **WHEN** a visitor answers safety questions for human impact, sensitive data, potential harm, explainability, human review, and correction or appeal
- **THEN** the system saves those inputs locally and displays a risk-aware pilot preview

#### Scenario: Visitor finishes Implement
- **WHEN** a visitor saves Implement inputs
- **THEN** the system offers a clear action to view the complete AI Upgrade Plan on `/plan`
