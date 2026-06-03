# UpSkill USA Product Requirements Document

## 1. Product Summary

UpSkill USA is a public, multilingual web portal that helps business leaders, workers, educators, and community partners move through a four-step AI workforce upgrade journey: Inspire, Learn, Adapt, and Implement.

The product stance is simple: "We don't fire. We upgrade." The portal frames AI adoption as a human-centered workforce transition, helping visitors identify personal value, learn practical AI skills, create an adaptation plan, and prototype human-reviewed workplace workflows.

This PRD reflects the current MVP application in this repository and defines the requirements for evolving it into a production-ready product.

## 2. Goals

- Present the UpSkill USA four-framework journey in a clear, polished, public portal.
- Help visitors understand how AI can upgrade work while preserving human dignity and judgment.
- Provide lightweight demos for IKIGAI discovery, learning pathways, adaptation planning, and workflow implementation.
- Support English, Spanish, and Portuguese MVP copy.
- Establish a visual and content foundation for future production features.

## 3. Non-Goals

- Authentication, accounts, or user profiles.
- Persistent form submission or CRM/event registration.
- Real AI content generation.
- Real company URL scanning, audit reports, ROI analysis, or workflow deployment.
- Payments, credentials, certifications, or employment guarantees.
- Database schema or backend service implementation.

## 4. Target Users

### Business Leaders

Need to identify AI-ready opportunities, prepare teams, and create measurable productivity gains without creating fear or displacement.

### Workers And Students

Need a motivating entry point that connects personal strengths to practical AI-enabled work.

### Educators And Community Colleges

Need a framework for teaching practical AI skills through formal programs, public resources, and role-based preparation.

### Employers, Chambers, And City Partners

Need a repeatable seminar and action-planning format that aligns employees and employers around adoption.

### Installer And Educator Agents

Future operational roles that help companies install AI, educate teams, and coordinate implementation.

## 5. Product Principles

- Human-first: AI should extend human judgment, creativity, care, and domain knowledge.
- Sequential: The core journey must remain Inspire -> Learn -> Adapt -> Implement.
- Practical: Each page should lead to a concrete next action or demo output.
- Transparent: Demo content must be labeled as demo or mock content.
- Accessible: The portal must work across desktop and mobile and support clear navigation.
- Multilingual: Key user-facing copy should be available in EN, ES, and PT, with translations flagged for human review before launch.

## 6. Current MVP Scope

### Overview Route

Route: `/`

Requirements:

- Introduce UpSkill USA and the four-framework journey.
- Show the brand promise and primary narrative.
- Link visitors into the ordered framework pages.
- Display persistent navigation and language controls.

Acceptance Criteria:

- A visitor can understand the product purpose from the first screen.
- A visitor can navigate to Inspire, Learn, Adapt, or Implement.
- The page does not require authentication.

### Inspire

Route: `/inspire`

Purpose: Help visitors answer "What's your gift?"

Requirements:

- Present the Inspire framework audience and summary.
- Provide an IKIGAI demo with four prompts:
  - What do you love?
  - What are you good at?
  - What does the world need?
  - What can you be paid for?
- Generate a local draft purpose statement from completed inputs.
- Show an empty state before all required inputs are provided.
- Guide visitors toward Learn as the next step.

Acceptance Criteria:

- The user can enter all four IKIGAI prompt responses.
- The app displays a draft purpose statement using the entered values.
- The generated statement is client-side only and does not imply persistence.

### Learn

Route: `/learn`

Purpose: Help visitors answer "How do you learn?"

Requirements:

- Present the Learn framework audience and summary.
- Explain the formal community college channel and free public learning channel.
- Provide a learning hub demo with role tracks:
  - Worker
  - Professor
  - Employer
- Display suggested resources for the selected track.
- Guide visitors toward Adapt as the next step.

Acceptance Criteria:

- The user can select a role track.
- The app displays role-specific learning resources.
- Learning resources are static MVP content.

### Adapt

Route: `/adapt`

Purpose: Help visitors answer "How do you adapt?"

Requirements:

- Present the Adapt framework audience and summary.
- Describe the six-hour Saturday seminar concept.
- Provide a local seminar interest preview.
- Provide an action plan builder with fields for:
  - Current role
  - What should be automated
  - What should be augmented
  - What the user will own
  - What the user will become
- Generate a local draft action plan summary.
- Guide visitors toward Implement as the next step.

Acceptance Criteria:

- The user can enter seminar interest details and see a local confirmation.
- The user can enter action plan inputs and see a draft plan summary.
- No seminar interest data is sent to a backend.

### Implement

Route: `/implement`

Purpose: Help visitors answer "How do you innovate?"

Requirements:

- Present the Implement framework audience and summary.
- Provide a mock company audit and workflow demo.
- Collect demo inputs for:
  - Company URL
  - Workflow name
  - Human review gate
- Display mock findings and a human-reviewed workflow summary.
- Clearly label audit findings, ROI, and workflow outputs as demo or mock content.
- Introduce Installer Agents, Educator Agents, and the "G.I. Bill for the AI Age" concept.

Acceptance Criteria:

- The user can enter workflow details and see a demo workflow summary.
- The app does not perform real URL scanning.
- The app does not imply production deployment or verified ROI.

## 7. Navigation And Information Architecture

Primary routes:

- `/` - Overview
- `/inspire` - Step 1
- `/learn` - Step 2
- `/adapt` - Step 3
- `/implement` - Step 4

Requirements:

- Desktop navigation must show Inspire, Learn, Adapt, and Implement in order.
- Mobile navigation must expose Overview plus all four framework pages.
- Each framework page should provide a clear next step.
- Active navigation state must be visible and accessible.

## 8. Localization Requirements

Supported MVP languages:

- English
- Spanish
- Portuguese

Requirements:

- English is the default language.
- The language toggle must update key navigation labels, calls to action, form labels, page summaries, and demo text.
- MVP translations may be draft quality but must be reviewed before public launch.

Future Requirements:

- Persist selected language across sessions.
- Set document language metadata dynamically.
- Add translation review workflow.

## 9. Content Requirements

Requirements:

- Core copy should remain concise and DOCX-derived.
- The four-step arc must remain visible throughout the experience.
- Use the corrected source metric: 22% of jobs disrupted by 2030.
- Treat "We don't fire. We upgrade." as an aspirational stance, not a legal guarantee.
- Do not imply employment guarantees, certification guarantees, or audited business outcomes.

## 10. UX And Design Requirements

Design source: `DESIGN.md`

Requirements:

- Use a polished enterprise portal style.
- Preserve the navy, royal blue, and gold visual system.
- Use Lucide-style icons where appropriate.
- Keep cards at 8px radius or less.
- Avoid nested cards.
- Use full-width page bands for major sections.
- Ensure forms, navigation, and generated summaries work on mobile without horizontal scrolling.
- Maintain visible focus states and adequate color contrast.

## 11. Technical Requirements

Current stack:

- Next.js
- React
- TypeScript
- Lucide React
- Static/local content in `src/lib/content.ts`
- Client-side state for demos and language selection

Requirements:

- The app must remain publicly accessible without authentication for the MVP.
- The app must build with `npm run build`.
- The app must pass linting with `npm run lint`.
- The app must pass type checking with `npm run typecheck`.
- Demo behavior must remain client-side unless a production feature explicitly adds backend services.

## 12. Analytics Requirements

Future analytics should measure:

- Page visits by route.
- Language selection.
- Framework card clicks.
- Demo starts and completions.
- Next-step CTA clicks.
- Mobile navigation usage.

Privacy Requirements:

- Do not collect free-text demo inputs without explicit consent and a retention policy.
- Avoid storing sensitive employer or employee information in analytics events.

## 13. Production Readiness Requirements

Before launch beyond MVP, the product should add:

- Human-reviewed translations.
- Content review for legal and claims risk.
- Persistent language preference.
- Analytics with privacy controls.
- Contact or partner inquiry flow.
- Clear disclaimers for demo tools.
- Accessibility review.
- Cross-browser and mobile QA.

## 14. Future Product Opportunities

- Real seminar registration and partner routing.
- Community college program directory.
- Public AI learning library with searchable resources.
- Role-specific GPT preparation workflow.
- Employer readiness assessment.
- Authenticated business workspace.
- Employee workflow submission and review.
- Human audit gate configuration.
- ROI and hours-saved calculators with documented assumptions.
- Installer Agent and Educator Agent operating dashboards.

## 15. Risks And Mitigations

### Risk: Demo Outputs May Be Mistaken For Real AI Or Audit Results

Mitigation: Label dynamic outputs as demo or mock content and avoid production claims.

### Risk: Workforce Promise Could Be Read As A Legal Guarantee

Mitigation: Keep the promise aspirational and avoid guaranteed employment or retention claims.

### Risk: Draft Translations May Be Inaccurate

Mitigation: Require human review before public multilingual launch.

### Risk: Future Analytics Could Capture Sensitive Inputs

Mitigation: Track interaction metadata only unless explicit consent and retention policies exist.

## 16. Success Metrics

MVP success indicators:

- Visitors can understand the four-step journey without explanation.
- Visitors can navigate all routes on desktop and mobile.
- Visitors can complete each demo flow.
- Visitors can switch between EN, ES, and PT.
- The app passes lint, typecheck, and build verification.

Future product metrics:

- CTA click-through rate from Overview to Inspire.
- Completion rate for each demo.
- Progression rate from one framework step to the next.
- Partner inquiry submissions.
- Seminar interest submissions.
- Employer workflow prototype submissions.

## 17. Open Questions

- What is the primary conversion goal: partner inquiry, seminar signup, employer consultation, or learning resource engagement?
- Should UpSkill USA prioritize workers, employers, educators, or city/community partners on the first screen?
- Which public learning resources should be included in the first production learning library?
- What legal language is required for the workforce promise and AI audit demos?
- Should future production workflows require authentication before collecting company or employee data?

