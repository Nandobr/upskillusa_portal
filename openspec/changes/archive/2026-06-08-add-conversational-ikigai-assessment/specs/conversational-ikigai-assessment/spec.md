## ADDED Requirements

### Requirement: Assessment pathways
The system SHALL provide four Conversational IKIGAI Assessment pathways: Career Explorer, Market Ready Check, Career Pivot Navigator, and AI Amplification Path.

#### Scenario: Visitor chooses a pathway
- **WHEN** a visitor opens the Inspiration assessment
- **THEN** the system displays the four pathway options with audience-specific labels and descriptions

#### Scenario: Pathway changes context
- **WHEN** a visitor selects a pathway
- **THEN** the system uses that pathway's preamble, current-situation options, feeling options, and recommendation logic for the rest of the assessment

### Requirement: In-page progressive assessment flow
The system SHALL render the assessment as an in-page progressive flow on the Inspiration page, revealing each next section below as the visitor progresses.

#### Scenario: Visitor starts the assessment
- **WHEN** a visitor selects a pathway
- **THEN** the system displays the IKIGAI preamble and optional first-name field on the Inspiration page without opening a modal

#### Scenario: Visitor completes a step
- **WHEN** a visitor provides the required input for the current assessment step
- **THEN** the system reveals the next assessment step below the completed content

#### Scenario: Visitor reviews previous answers
- **WHEN** a visitor has progressed past an assessment step
- **THEN** the system keeps earlier answers visible or reviewable on the same page so the visitor can understand how results were produced

### Requirement: Assessment answer collection
The system SHALL collect pathway-specific current situation, feelings, human skills, interests, and work-style answers for use in matching and plan output.

#### Scenario: Visitor selects current situation
- **WHEN** a visitor selects a current-situation option
- **THEN** the system records the selected option for the active pathway

#### Scenario: Visitor selects feelings
- **WHEN** a visitor selects one or more feeling chips
- **THEN** the system records all selected feelings without using them to alter occupation scoring

#### Scenario: Visitor selects human skills
- **WHEN** a visitor selects human skills
- **THEN** the system records the selected skills and their mapped occupation categories for matching

#### Scenario: Visitor selects interests and work styles
- **WHEN** a visitor selects interest areas and work-style preferences
- **THEN** the system records those selections and their mapped occupation categories for matching

### Requirement: Occupation dataset
The system SHALL use all 342 occupations from the referenced assessment dataset for local matching and result display.

#### Scenario: Matching uses occupation records
- **WHEN** the system computes career matches
- **THEN** it uses occupation records containing title, slug, category, pay, jobs, outlook, outlook description, education, exposure, exposure rationale, URL, vulnerability score, and vulnerability label

#### Scenario: Dashboard-wide data is not required
- **WHEN** the assessment is implemented
- **THEN** the system does not require the reference app's NEWS_TICKER or GLOBAL_INDICATORS data to complete the assessment flow

### Requirement: Deterministic matching engine
The system SHALL compute occupation matches locally using the reference assessment scoring logic.

#### Scenario: Human skill category matches
- **WHEN** an occupation category matches a selected human skill category
- **THEN** the system adds 10 points to that occupation's score

#### Scenario: Interest category matches
- **WHEN** an occupation category matches a selected interest area category
- **THEN** the system adds 8 points to that occupation's score

#### Scenario: Work-style category matches
- **WHEN** an occupation category matches a selected work-style category
- **THEN** the system adds 6 points to that occupation's score

#### Scenario: AI vulnerability modifier
- **WHEN** an occupation has vulnerability score 7 or higher
- **THEN** the system subtracts 8 points from that occupation's score

#### Scenario: Moderate vulnerability modifier
- **WHEN** an occupation has vulnerability score 5 or 6
- **THEN** the system subtracts 3 points from that occupation's score

#### Scenario: Lower vulnerability modifier
- **WHEN** an occupation has vulnerability score 4 or lower
- **THEN** the system adds 5 points to that occupation's score

#### Scenario: Growth outlook modifier
- **WHEN** an occupation has projected outlook of at least 10 percent
- **THEN** the system adds 4 points to that occupation's score

#### Scenario: Strong growth outlook modifier
- **WHEN** an occupation has projected outlook of at least 20 percent
- **THEN** the system adds an additional 3 points to that occupation's score

#### Scenario: AI amplification exposure modifier
- **WHEN** the active pathway is AI Amplification Path and an occupation has exposure score 7 or higher
- **THEN** the system adds 5 points to that occupation's score

#### Scenario: Ranked matches
- **WHEN** matching completes
- **THEN** the system ranks occupations by score and displays the top 12 matches

### Requirement: Ranked match results
The system SHALL display ranked occupation matches with career details and local demo/source framing.

#### Scenario: Visitor views top matches
- **WHEN** matching completes
- **THEN** the system displays each top match's rank, title, category, vulnerability score and label, median pay, growth outlook, and employment size

#### Scenario: Result output is framed as guidance
- **WHEN** the system displays ranked matches
- **THEN** it labels the results as local MVP/demo guidance and does not imply employment guarantees or official career certification

### Requirement: Career comparison
The system SHALL allow the visitor to compare up to three matched occupations side-by-side.

#### Scenario: Visitor selects occupations for comparison
- **WHEN** a visitor selects matched occupations to compare
- **THEN** the system stores up to three selected occupation identifiers for comparison

#### Scenario: Visitor compares careers
- **WHEN** at least two occupations are selected for comparison
- **THEN** the system displays vulnerability, exposure, employment size, median pay, growth outlook, and education side-by-side

#### Scenario: Visitor views exposure rationale
- **WHEN** the comparison is displayed
- **THEN** the system shows the exposure rationale and source URL for each compared occupation

### Requirement: Personalized action plan
The system SHALL generate pathway-specific action recommendations from the selected or best matched occupation.

#### Scenario: Explorer receives recommendations
- **WHEN** the visitor uses the Career Explorer pathway
- **THEN** the system generates recommendations based on the best compared or top matched occupation's vulnerability level

#### Scenario: Market-ready visitor receives recommendations
- **WHEN** the visitor uses the Market Ready Check pathway
- **THEN** the system generates recommendations based on the best compared or top matched occupation's vulnerability, exposure, category, growth, and employment size

#### Scenario: Pivot visitor receives recommendations
- **WHEN** the visitor uses the Career Pivot Navigator pathway
- **THEN** the system generates transferability and reskilling recommendations based on the best compared or top matched occupation

#### Scenario: Amplification visitor receives recommendations
- **WHEN** the visitor uses the AI Amplification Path pathway
- **THEN** the system generates recommendations focused on working with AI in the matched occupation category

### Requirement: Local assessment persistence
The system SHALL persist the full assessment result locally in the browser as part of the AI Upgrade Plan draft.

#### Scenario: Visitor saves assessment result
- **WHEN** a visitor completes the assessment results or comparison step
- **THEN** the system stores the selected pathway, answers, top matches, comparison selections, and action recommendations in local browser storage

#### Scenario: Visitor refreshes Inspiration
- **WHEN** a visitor refreshes the page after saving assessment progress
- **THEN** the system restores the saved assessment result from local browser storage

#### Scenario: Visitor clears plan
- **WHEN** a visitor clears the locally saved AI Upgrade Plan
- **THEN** the system removes the saved assessment result along with the rest of the local plan draft

### Requirement: Plan assessment output
The system SHALL display the full saved assessment result in `/plan`.

#### Scenario: Visitor views plan after assessment
- **WHEN** a visitor opens `/plan` after saving the assessment result
- **THEN** the system displays the selected pathway, assessment answers summary, top occupation matches, selected comparison careers, and personalized action recommendations

#### Scenario: Visitor has old lightweight Inspire draft
- **WHEN** a visitor opens `/plan` with a saved draft from the previous lightweight Inspiration form
- **THEN** the system displays the available legacy Inspire information without crashing and allows the visitor to return to Inspiration to complete the new assessment

#### Scenario: Visitor copies or downloads plan
- **WHEN** a visitor copies or downloads the plan after saving the assessment result
- **THEN** the exported text includes the saved assessment result summary and recommendations

### Requirement: English-first assessment copy
The system SHALL support English-first assessment copy with graceful fallback for Spanish and Portuguese until full translations are available.

#### Scenario: Visitor uses English
- **WHEN** the visitor selects English
- **THEN** the system displays assessment pathway, prompt, result, comparison, and recommendation copy in English

#### Scenario: Visitor uses Spanish or Portuguese
- **WHEN** the visitor selects Spanish or Portuguese and assessment-specific translated copy is unavailable
- **THEN** the system displays English fallback copy instead of missing labels or broken UI
