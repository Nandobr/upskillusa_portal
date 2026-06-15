## REMOVED Requirements

### Requirement: Implement mock audit and workflow demo

**Reason**: Step 4 is being replaced by a two-audience AI Implementation Lab that demonstrates leader opportunity and employee task transformation value more directly.

**Migration**: Use the new Implement AI Implementation Lab requirement for `/implement`.

## ADDED Requirements

### Requirement: Implement AI Implementation Lab
The Implement route SHALL present Step 4 as an audience-gated AI Implementation Lab with Business Leader and Employee journeys that produce report outputs and save a first pilot into the local AI-Ready Action Plan.

#### Scenario: Visitor opens Step 4
- **WHEN** a visitor navigates to `/implement`
- **THEN** the system displays an audience choice between Business Leader and Employee before showing path-specific inputs

#### Scenario: Business leader enters audit inputs
- **WHEN** a visitor chooses Business Leader
- **THEN** the system asks for company URL and email using the Step-page guided-builder style

#### Scenario: Business leader generates live report when audit keys are configured
- **WHEN** a Business Leader submits a company URL and email and live audit keys are configured
- **THEN** the system generates an AI Opportunity Report with opportunity score, estimated value or hours opportunity, FTE equivalent, operational opportunity areas, and first pilot options

#### Scenario: Business leader views demo report when audit keys are missing
- **WHEN** a Business Leader submits a company URL and email and required live audit keys are not configured
- **THEN** the system displays a clearly labeled demo AI Opportunity Report inspired by the reference app instead of blocking the page

#### Scenario: Employee chooses work context
- **WHEN** a visitor chooses Employee
- **THEN** the system asks for work area, task-chip selections, and optional custom tasks without requiring prior Step 3 data

#### Scenario: Employee generates task transformation report
- **WHEN** an Employee submits at least the required work area and selected tasks
- **THEN** the system generates a Task Transformation Report with AUTOMATE, AUGMENT, and OWN classifications, estimated monthly hours saved, FTE equivalent, task-level AI actions, human ownership notes, and suggested tools

#### Scenario: Visitor reviews report loading state
- **WHEN** either report is generating
- **THEN** the system displays a loading checklist that communicates mapping, classification, value estimation, and pilot preparation progress

#### Scenario: Visitor selects a first pilot
- **WHEN** either report is available
- **THEN** the system allows the visitor to choose one first pilot from the generated opportunity or task options

#### Scenario: Visitor saves Step 4
- **WHEN** a visitor selects a first pilot and activates save
- **THEN** the system stores the selected audience, report output, first pilot, and guardrail/safety state in the local AI-Ready Action Plan and treats Step 4 as complete

#### Scenario: Visitor starts over
- **WHEN** a visitor activates Start Over after making Step 4 progress
- **THEN** the system clears Step 4 selections and report state without clearing other saved plan steps
