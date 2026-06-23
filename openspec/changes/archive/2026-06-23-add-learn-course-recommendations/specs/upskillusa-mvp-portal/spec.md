## ADDED Requirements

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
