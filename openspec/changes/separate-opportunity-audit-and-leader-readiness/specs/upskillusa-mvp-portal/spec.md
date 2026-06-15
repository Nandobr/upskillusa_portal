## REMOVED Requirements

### Requirement: Implement mock audit and workflow demo
**Reason**: Step 4 should no longer be a company URL audit or generic mock workflow form. The company-level audit is moving to the new Opportunity page, and Step 4 is becoming a personal readiness and first-pilot builder.

**Migration**: Use the new Implement personal AI readiness lab requirement for `/implement` and the new Opportunity company audit requirement for `/opportunity`.

## MODIFIED Requirements

### Requirement: Public portal routes
The system SHALL provide a public, unauthenticated UpSkill USA portal with separate routes for the overview, the four-framework sequence, and the company Opportunity audit.

#### Scenario: Visitor opens the portal overview
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays an overview of the UpSkill USA four-framework journey and links to Inspire, Learn, Adapt, and Implement

#### Scenario: Visitor opens each framework route
- **WHEN** a visitor navigates to `/inspire`, `/learn`, `/adapt`, or `/implement`
- **THEN** the system displays the corresponding framework page without requiring sign-in

#### Scenario: Visitor opens the Opportunity route
- **WHEN** a visitor navigates to `/opportunity`
- **THEN** the system displays a public company-level AI opportunity audit page without requiring sign-in

### Requirement: Sequential navigation
The system SHALL present the Opportunity link and the framework navigation in a stable top navigation, preserving the framework sequence Inspire, Learn, Seminar, Implement.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Opportunity plus Inspire, Learn, Seminar, and Implement in order

#### Scenario: Visitor views mobile navigation
- **WHEN** a visitor views any portal route on a mobile viewport
- **THEN** the system provides accessible navigation to Opportunity and all four framework routes

## ADDED Requirements

### Requirement: Implement personal AI readiness lab
The Implement route SHALL present Step 4 as a personal AI readiness and first-pilot builder for Business Leaders and Employees, without requiring company URL or email inputs.

#### Scenario: Visitor opens Step 4
- **WHEN** a visitor navigates to `/implement`
- **THEN** the system displays an audience choice between Business Leader and Employee before showing path-specific report inputs

#### Scenario: Business leader starts personal readiness journey
- **WHEN** a visitor chooses Business Leader
- **THEN** the system lets the visitor choose any available work area before selecting responsibilities or tasks

#### Scenario: Employee starts task transformation journey
- **WHEN** a visitor chooses Employee
- **THEN** the system lets the visitor choose a work area before selecting task chips and optional custom tasks

#### Scenario: Visitor progresses through Step 4 inputs
- **WHEN** a visitor completes each Step 4 input section
- **THEN** the system reveals the next relevant section without requiring unanswered future sections to be reviewed first

#### Scenario: Business leader generates personal report
- **WHEN** a Business Leader submits the selected work area and selected responsibilities or tasks
- **THEN** the system generates a `Personal AI Readiness Report` with readiness band, estimated monthly hours saved, FTE equivalent, AUTOMATE/AUGMENT/OWN classifications, recommended AI tools, task or responsibility breakdown, and first-pilot options

#### Scenario: Employee generates task report
- **WHEN** an Employee submits the selected work area and selected tasks
- **THEN** the system generates a `Task Transformation Report` with readiness band, estimated monthly hours saved, FTE equivalent, AUTOMATE/AUGMENT/OWN classifications, recommended AI tools, task-by-task breakdown, and first-pilot options

#### Scenario: Visitor selects first pilot
- **WHEN** either personal report is available
- **THEN** the system allows the visitor to choose one first pilot from the generated task or responsibility options

#### Scenario: Visitor saves Step 4
- **WHEN** a visitor selects a first pilot and activates save
- **THEN** the system stores the selected audience, personal report output, first pilot, and guardrail/safety state in the local AI-Ready Action Plan and treats Step 4 as complete

#### Scenario: Visitor starts over
- **WHEN** a visitor activates Start Over after making Step 4 progress
- **THEN** the system clears Step 4 selections and report state without clearing other saved plan steps

### Requirement: Opportunity company audit page
The system SHALL provide a top-level Opportunity page that runs the company URL audit flow separately from Step 4.

#### Scenario: Visitor opens Opportunity page
- **WHEN** a visitor navigates to `/opportunity`
- **THEN** the system displays a company-level AI opportunity audit hero with a company URL input

#### Scenario: Visitor submits company URL
- **WHEN** a visitor submits a company URL on the Opportunity page
- **THEN** the system asks for a report contact email before generating the audit

#### Scenario: Visitor generates live audit when keys are configured
- **WHEN** a visitor submits a company URL and email and live audit keys are configured
- **THEN** the system generates a company AI opportunity audit with company context, opportunity score, value or hours estimate, FTE equivalent, operational pain or opportunity areas, and first pilot options

#### Scenario: Visitor views demo audit when keys are missing
- **WHEN** a visitor submits a company URL and email and required live audit keys are not configured
- **THEN** the system displays a clearly labeled demo company opportunity report instead of blocking the page

#### Scenario: Visitor reviews audit loading state
- **WHEN** the Opportunity audit is generating
- **THEN** the system displays a loading checklist that communicates website scanning, company intelligence enrichment, workforce calculation, and value modeling progress

#### Scenario: Visitor prints or saves audit
- **WHEN** an Opportunity audit report is available
- **THEN** the system provides a print or save-PDF affordance for the report view

#### Scenario: Visitor restarts audit
- **WHEN** a visitor activates the restart or change-company action
- **THEN** the system returns to the Opportunity URL input flow without changing any saved Step 4 plan data
