## ADDED Requirements

### Requirement: Progressive plan draft
The system SHALL maintain a shared AI Upgrade Plan draft across the Inspire, Learn, Adapt, and Implement framework pages using client-side MVP persistence.

#### Scenario: Visitor saves Inspire inputs
- **WHEN** a visitor completes the Inspire plan inputs
- **THEN** the system stores the Inspire section of the plan draft locally in the browser

#### Scenario: Visitor continues to another framework page
- **WHEN** a visitor saves one framework page and navigates to the next framework page
- **THEN** the system preserves previously saved plan inputs for use in the plan summary

#### Scenario: Visitor refreshes the page
- **WHEN** a visitor refreshes the browser after saving plan inputs
- **THEN** the system restores the saved plan draft from local browser storage

### Requirement: Plan completeness levels
The system SHALL classify the AI Upgrade Plan into four completeness levels based on the latest completed framework step.

#### Scenario: Inspire is complete
- **WHEN** the visitor has saved Inspire inputs but has not saved Learn inputs
- **THEN** the system displays the plan as Level 1: Opportunity Seed

#### Scenario: Learn is complete
- **WHEN** the visitor has saved Inspire and Learn inputs but has not saved Adapt inputs
- **THEN** the system displays the plan as Level 2: Learning Path

#### Scenario: Adapt is complete
- **WHEN** the visitor has saved Inspire, Learn, and Adapt inputs but has not saved Implement inputs
- **THEN** the system displays the plan as Level 3: AI Opportunity Draft

#### Scenario: Implement is complete
- **WHEN** the visitor has saved all four framework sections
- **THEN** the system displays the plan as Level 4: Complete AI Upgrade Plan

### Requirement: Plan summary route
The system SHALL provide a `/plan` route that displays the current AI Upgrade Plan based on completed framework inputs.

#### Scenario: Visitor views a partial plan
- **WHEN** a visitor opens `/plan` after completing fewer than four framework steps
- **THEN** the system displays the completed plan sections, the current completeness level, next 3 days guidance, and a CTA to continue the next framework step

#### Scenario: Visitor views a complete plan
- **WHEN** a visitor opens `/plan` after completing all four framework steps
- **THEN** the system displays the full AI Upgrade Plan, next 7 days guidance, and after-7-days momentum options

#### Scenario: Visitor has no saved plan
- **WHEN** a visitor opens `/plan` before saving any framework inputs
- **THEN** the system displays an empty plan state and a CTA to start with Inspire

### Requirement: Deterministic plan generation
The system SHALL generate AI Upgrade Plan content from local templates and rules without calling an AI API or backend service.

#### Scenario: Plan is generated
- **WHEN** the visitor opens `/plan`
- **THEN** the system generates the displayed plan from saved local inputs, work category metadata, learning recommendations, safety answers, and fixed templates

#### Scenario: Plan generation boundaries are visible
- **WHEN** the system displays generated plan content
- **THEN** the system labels the output as local MVP guidance and does not imply real AI generation, audited ROI, or production deployment

### Requirement: Work category and process mapping
The system SHALL use original lightweight work categories and process mapping questions to identify the user's AI opportunity.

#### Scenario: Visitor completes Adapt process mapping
- **WHEN** a visitor enters workflow category, workflow pain, delays, repetitive work, judgment needs, and desired outcome
- **THEN** the system uses those inputs to generate an AI opportunity draft

#### Scenario: Visitor has not selected a category
- **WHEN** a visitor has not selected a work category
- **THEN** the system still generates available plan sections and prompts the visitor to complete Adapt for a clearer workflow opportunity

### Requirement: Safety checklist and risk level
The system SHALL use a plain-language NIST-inspired safety checklist to classify the plan as low, medium, or high risk and recommend an appropriate human review gate.

#### Scenario: Low-risk workflow
- **WHEN** safety answers indicate no sensitive data, low human impact, low harm potential, and clear review responsibility
- **THEN** the system classifies the plan as low risk and recommends AI assistance for drafts, summaries, routing, or formatting

#### Scenario: Medium-risk workflow
- **WHEN** safety answers indicate human impact, sensitive data, or meaningful error consequences
- **THEN** the system classifies the plan as medium risk and requires human approval before external action

#### Scenario: High-risk workflow
- **WHEN** safety answers indicate employment, pay, benefits, health, education, legal status, or other high-impact decisions
- **THEN** the system classifies the plan as high risk and recommends AI only for preparation or research while final decisions remain human-led

### Requirement: Next-step guidance
The system SHALL include actionable next-step guidance in every AI Upgrade Plan.

#### Scenario: Visitor views a partial plan
- **WHEN** the plan is Level 1, Level 2, or Level 3
- **THEN** the system displays a next 3 days section and a recommendation to continue the next framework step

#### Scenario: Visitor views a complete plan
- **WHEN** the plan is Level 4
- **THEN** the system displays a next 7 days section with pilot actions and an after-7-days section with Learn More, Run A Bigger Pilot, and Get Help Implementing options

### Requirement: Plan copy and download
The system SHALL allow visitors to copy or download their current AI Upgrade Plan without requiring an account.

#### Scenario: Visitor copies the plan
- **WHEN** a visitor activates the copy action on `/plan`
- **THEN** the system copies a text version of the current plan to the clipboard or reports an actionable browser limitation

#### Scenario: Visitor downloads the plan
- **WHEN** a visitor activates the download action on `/plan`
- **THEN** the system downloads a text version of the current plan

### Requirement: Clear plan reset
The system SHALL allow visitors to clear their locally saved AI Upgrade Plan draft.

#### Scenario: Visitor clears plan progress
- **WHEN** a visitor activates the clear plan action and confirms the choice
- **THEN** the system removes the locally saved plan draft and returns `/plan` to the empty state
