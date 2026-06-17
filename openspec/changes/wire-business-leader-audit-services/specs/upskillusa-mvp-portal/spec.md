## MODIFIED Requirements

### Requirement: Implement mock audit and workflow demo
The Implement route SHALL include a Business Leader URL audit path that can operate in live mode when service keys are configured and otherwise continues to return clearly labeled demo content.

#### Scenario: Business Leader live audit services are configured
- **WHEN** a visitor submits a valid company URL and email
- **THEN** the system SHALL create a pending lead when Supabase server credentials are configured
- **AND** SHALL gather website and company context from Firecrawl and The Companies API when those keys are configured
- **AND** SHALL use OpenAI structured output to generate the audit
- **AND** SHALL compute value/cost metrics deterministically from company enrichment and pain categories
- **AND** SHALL attempt to send the audit email automatically through Resend
- **AND** SHALL finalize the Supabase lead with completed status, audit JSON, enrichment JSON, and error state
- **AND** SHALL return the existing BusinessOpportunityReport UI shape

#### Scenario: Business Leader live audit keys are missing
- **WHEN** the required OpenAI key is not configured
- **THEN** the system SHALL return the existing labeled demo BusinessOpportunityReport
- **AND** SHALL not fail because Supabase, Firecrawl, The Companies API, or Resend are absent

#### Scenario: Employee report path is used
- **WHEN** a visitor generates an Employee or personal task report
- **THEN** the system SHALL continue to use the existing Gemini/local fallback path without depending on Business Leader URL audit services
