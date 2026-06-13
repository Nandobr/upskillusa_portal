## ADDED Requirements

### Requirement: Cascading selectable Learn pathway
The system SHALL provide a Step 2 LEARN pathway that uses selectable options only and reveals each next question based on prior selections.

#### Scenario: Visitor starts the Learn pathway
- **WHEN** a visitor opens the Learn pathway
- **THEN** the system displays the first selectable question asking which broad group the visitor belongs to

#### Scenario: Visitor selects a broad group
- **WHEN** a visitor selects Student, Educator, Worker, or Entrepreneur
- **THEN** the system records the selected group and reveals the AI starting point question

#### Scenario: Visitor changes an earlier selection
- **WHEN** a visitor changes a selection from an earlier pathway step
- **THEN** the system clears downstream selections that no longer apply and updates the next available options

### Requirement: Broad group filter
The system SHALL offer exactly four broad group options as the first Learn pathway filter: Student, Educator, Worker, and Entrepreneur.

#### Scenario: Visitor views broad group options
- **WHEN** the broad group filter is displayed
- **THEN** the system shows Student, Educator, Worker, and Entrepreneur as selectable options without requiring free-text input

### Requirement: AI starting point filter
The system SHALL offer exactly three AI starting point options after the broad group filter: New to AI, Tried AI a Few Times, and Ready to Use AI at Work.

#### Scenario: Visitor views AI starting point options
- **WHEN** the AI starting point filter is displayed
- **THEN** the system shows New to AI, Tried AI a Few Times, and Ready to Use AI at Work as selectable options without requiring free-text input

### Requirement: Group-specific goal filter
The system SHALL offer exactly three practical goal options based on the selected broad group.

#### Scenario: Student goal options
- **WHEN** the visitor selects Student
- **THEN** the system offers Study and Understand Faster, Research and Summarize Sources, and Prepare Resumes, Projects, or Presentations

#### Scenario: Educator goal options
- **WHEN** the visitor selects Educator
- **THEN** the system offers Create Teaching Materials, Guide Students on Responsible AI Use, and Save Time on Planning and Feedback

#### Scenario: Worker goal options
- **WHEN** the visitor selects Worker
- **THEN** the system offers Write and Communicate Better, Summarize Documents or Meetings, and Save Time on Routine Tasks

#### Scenario: Entrepreneur goal options
- **WHEN** the visitor selects Entrepreneur
- **THEN** the system offers Plan My Business or Offer, Create Marketing and Sales Content, and Organize Operations and Follow-Up

### Requirement: Tool filter
The system SHALL offer selectable tool options based on the selected goal while including Gemini in general LLM/tool option sets.

#### Scenario: General LLM tool options
- **WHEN** the selected goal maps to general AI writing, prompting, planning, communication, teaching material, marketing, or routine-task support
- **THEN** the system offers ChatGPT, Claude, Gemini, and Microsoft Copilot as selectable tool options

#### Scenario: Document-heavy tool options
- **WHEN** the selected goal maps to research, source summarization, document summarization, or meeting/document work
- **THEN** the system offers NotebookLM, ChatGPT, Claude, and Microsoft Copilot as selectable tool options

### Requirement: Learning format and time filters
The system SHALL offer exactly three learning format options and exactly three time options.

#### Scenario: Visitor views learning format options
- **WHEN** the learning format filter is displayed
- **THEN** the system shows Watch, Read, and Practice as selectable options

#### Scenario: Visitor views time options
- **WHEN** the time filter is displayed
- **THEN** the system shows 10 Minutes, 30 Minutes, and 1 Hour as selectable options

### Requirement: Generated LEARN Report
The system SHALL generate a compact LEARN Report after all Learn pathway filters are selected.

#### Scenario: Visitor completes all filters
- **WHEN** the visitor has selected a group, AI starting point, goal, tool, learning format, and time option
- **THEN** the system displays a generated LEARN Report using those selections

#### Scenario: Visitor views generated report sections
- **WHEN** the generated LEARN Report is displayed
- **THEN** the system shows the selected path, a recommended learning path, a tool starter guide, one practice prompt, one next action, copy/download actions, and a save-to-plan action

### Requirement: Downloadable internal demo report
The system SHALL allow the visitor to copy or download the generated LEARN Report as an internal demo artifact.

#### Scenario: Visitor copies the report
- **WHEN** the visitor activates the copy report action
- **THEN** the system copies the generated LEARN Report text to the clipboard or provides an equivalent local copy affordance

#### Scenario: Visitor downloads the report
- **WHEN** the visitor activates the download report action
- **THEN** the system downloads the generated LEARN Report as a local text or markdown file

#### Scenario: Visitor views report labeling
- **WHEN** the visitor views the generated LEARN Report
- **THEN** the system labels the report as demo content and does not imply live AI generation, live curation, or external verification

### Requirement: Save LEARN Report to AI Upgrade Plan
The system SHALL save the generated LEARN Report summary to the local AI Upgrade Plan and treat Step 2 as complete without automatically navigating to Step 3.

#### Scenario: Visitor saves LEARN Report
- **WHEN** the visitor activates the save-to-plan action from the generated LEARN Report
- **THEN** the system saves the selected group, AI starting point, goal, tool, learning format, time option, and recommended next learning action to the local AI Upgrade Plan

#### Scenario: Learn save completes Step 2
- **WHEN** the LEARN Report is saved to the local AI Upgrade Plan
- **THEN** the system treats the Learn step as complete for plan progress

#### Scenario: Visitor remains on Learn after save
- **WHEN** the LEARN Report is saved to the local AI Upgrade Plan
- **THEN** the system keeps the visitor on the Learn page and does not automatically route to Adapt
