## Why

UpSkill USA needs a minimal, elegant web portal that turns the "One Portal. Four Frameworks." concept from the source DOCX into a browsable MVP. The first version should establish the product story, visual direction, and lightweight demo interactions without committing to authentication, database schema, or real AI/audit integrations.

## What Changes

- Create a new public, unauthenticated Next.js + TypeScript + Node.js app.
- Add four separate portal routes in sequence: `/inspire`, `/learn`, `/adapt`, and `/implement`.
- Add a landing/overview route that introduces the four-framework journey and routes visitors into the sequence.
- Add static/client-side demo flows:
  - IKIGAI prompts and purpose statement on Inspire.
  - Learning hub content on Learn.
  - Seminar interest flow and simple action plan builder on Adapt.
  - Clearly mocked company audit/workflow-builder experience on Implement.
- Add a simple client-side `EN / ES / PT` language toggle for key UI copy and concise page content.
- Add `DESIGN.md` to define the MVP design system based on the Lovable reference app: deep navy, royal blue, gold, elegant enterprise cards, pill navigation, Lucide-style iconography, and polished responsive layouts.
- Use DOCX-derived draft copy for core portal language and clearly label dynamic outputs as demo content.
- Extract or include the UpSkill USA logo asset from the Lovable app for local use.

## Capabilities

### New Capabilities

- `upskillusa-mvp-portal`: Public multilingual MVP portal for the four-framework UpSkill USA journey, including static/client-side demo interactions and local design guidance.

### Modified Capabilities

- None.

## Impact

- Adds a new Next.js application scaffold and package scripts for development, linting, type checking, and building.
- Adds local static assets, including the UpSkill USA logo.
- Adds localized copy/content constants for English, Spanish, and Portuguese.
- Adds `DESIGN.md` as the design-system source for future UI work.
- Does not add authentication, persistence, database schema changes, payments, CRM integration, real company URL scanning, real AI generation, or production event registration.
