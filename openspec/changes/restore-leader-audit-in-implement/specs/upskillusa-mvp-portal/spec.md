## MODIFIED Requirements

### Requirement: Sequential navigation
The system SHALL present the framework navigation in the sequence Inspire, Learn, Seminar, Implement across the portal, without a top-level Opportunity navigation item.

#### Scenario: Visitor views desktop navigation
- **WHEN** a visitor views any portal route on a desktop viewport
- **THEN** the system displays persistent navigation with Inspire, Learn, Seminar, and Implement in order
- **THEN** the system does not display Opportunity as a top-level navigation item

#### Scenario: Visitor views mobile navigation
- **WHEN** a visitor views any portal route on a mobile viewport
- **THEN** the system provides accessible navigation to all four framework routes
- **THEN** the system does not display Opportunity as a mobile navigation item

### Requirement: Implement mock audit and workflow demo
The Implement route SHALL present Step 4 as a role-specific AI implementation lab where Business Leaders run a company URL/email audit and Employees generate a task transformation report.

#### Scenario: Visitor opens Step 4
- **WHEN** a visitor navigates to `/implement`
- **THEN** the system displays an audience choice between Business Leader and Employee / Worker before showing path-specific inputs

#### Scenario: Business leader enters company URL
- **WHEN** a visitor chooses Business Leader
- **THEN** the system asks for a company URL as the first Business Leader input

#### Scenario: Business leader enters email after URL
- **WHEN** a Business Leader enters a valid company URL
- **THEN** the system reveals a contact email input in the same Business Leader path before generating the audit

#### Scenario: Business leader generates company audit
- **WHEN** a Business Leader submits a valid company URL and contact email
- **THEN** the system generates an AI Opportunity Report with company context, opportunity score, value or hours estimate, FTE equivalent, operational pain or opportunity areas, first pilot options, print/save affordance, and a labeled demo fallback when live audit keys are missing or the live audit fails

#### Scenario: Business leader selects first pilot
- **WHEN** a Business Leader selects a first opportunity from the AI Opportunity Report
- **THEN** the system opens the guardrails/save step using that opportunity as the first pilot

#### Scenario: Employee starts task transformation journey
- **WHEN** a visitor chooses Employee / Worker
- **THEN** the system lets the visitor choose a work area before selecting task chips and optional custom tasks

#### Scenario: Employee generates task report
- **WHEN** an Employee submits the selected work area and selected tasks
- **THEN** the system generates a Task Transformation Report with readiness band, estimated monthly hours saved, FTE equivalent, AUTOMATE/AUGMENT/OWN classifications, recommended AI tools, task-by-task breakdown, and first-pilot options

#### Scenario: Employee selects first pilot
- **WHEN** an Employee selects one generated task as the first pilot
- **THEN** the system opens the guardrails/save step using that task as the first pilot

#### Scenario: Visitor saves Step 4
- **WHEN** a visitor selects a first pilot and activates save
- **THEN** the system stores the selected audience, generated report output, first pilot, and guardrail/safety state in the local AI-Ready Action Plan and treats Step 4 as complete

#### Scenario: Visitor starts over
- **WHEN** a visitor activates Start Over after making Step 4 progress
- **THEN** the system clears Step 4 selections and report state without clearing other saved plan steps
