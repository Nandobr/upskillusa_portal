## Context

The repository currently contains OpenSpec configuration, project instructions, and the source DOCX, but no application code or design-system document. The MVP will create the first public UpSkill USA web app as a small, reviewable Next.js + TypeScript project.

The source DOCX is the product source of truth. The Lovable reference app is the visual reference: deep navy hero surfaces, gold accents, clean enterprise cards, pill navigation, strong metric sections, and Lucide-style icons. The MVP is a polished informational portal with light client-side demo widgets, not a production platform.

## Goals / Non-Goals

**Goals:**

- Build a public, unauthenticated portal with separate routes for the four-framework journey.
- Use DOCX-derived draft copy for core content and clearly marked demo content for dynamic outputs.
- Provide concise English, Spanish, and Portuguese UI/content through a client-side language toggle.
- Add `DESIGN.md` so future UI work has a local design source.
- Keep flows static/client-side so the MVP can be built and reviewed without backend dependencies.
- Include local scripts for development, lint, type check, and build verification.

**Non-Goals:**

- No authentication, role-based access, dashboards, or user accounts.
- No database, Drizzle schema, migrations, or persistence.
- No real AI generation, real company URL scan, CRM, payment, event registration, or credential verification.
- No long-form research translation beyond concise MVP content.
- No production legal/compliance validation for trademarks, slogans, statistics, or employment guarantees.

## Decisions

- Use Next.js App Router with TypeScript.
  - Rationale: matches the user's chosen stack and supports clean routes, static rendering, and future expansion.
  - Alternative considered: Vite React. It is simpler, but Next.js better matches the expected `next build` verification workflow from project instructions.

- Implement separate routes: `/`, `/inspire`, `/learn`, `/adapt`, and `/implement`.
  - Rationale: the user chose separate routes, and the DOCX frames the four tabs as a sequence visitors should navigate.
  - Alternative considered: single-page tabs. It would be smaller, but less aligned with routeable portal behavior.

- Keep state client-side and ephemeral.
  - Rationale: the MVP should demonstrate the experience without creating schema or backend commitments.
  - Alternative considered: storing form output in a database. That would increase scope and trigger schema/migration work before the product shape is validated.

- Use structured local content constants for EN/ES/PT.
  - Rationale: the content set is small enough for static constants, and a simple toggle is enough for MVP review.
  - Alternative considered: route prefixes such as `/es/inspire`. Better for production SEO, but unnecessary for the first static demo.

- Use DOCX-derived draft copy for core content and demo placeholders for generated outputs.
  - Rationale: avoids generic placeholder copy while keeping uncertain product claims honest.
  - Alternative considered: write all-new marketing copy. That risks drifting from the product source of truth.

- Create `DESIGN.md` as part of the implementation.
  - Rationale: `AGENTS.md` requires `@DESIGN.md`, but the file does not yet exist.
  - Alternative considered: embed style notes only in components. That would leave future work without a local design reference.

- Extract the logo asset from the Lovable app and commit it locally.
  - Rationale: the user requested the Lovable logo, and local assets avoid runtime dependency on the external app.
  - Alternative considered: hotlink the external asset. That is brittle and less reviewable.

## Risks / Trade-offs

- Broad MVP surface across four routes and three languages -> Keep interactions lightweight, reuse page patterns, and avoid backend work.
- Mock audit could be mistaken for a real company scan -> Label Implement outputs as demo/mock content and avoid implying live analysis.
- Source DOCX includes conflicting statistics -> Prefer verified figures from the DOCX notes, especially `22% of jobs disrupted by 2030`, and avoid unverified numeric claims.
- EN/ES/PT copy may need human polish -> Treat translations as draft MVP copy and flag them for human review.
- Logo extraction depends on network availability -> Include a task to download the asset, with a fallback to a text-only mark if the asset cannot be fetched during implementation.
- Lovable style could be copied too literally -> Use the reference for palette, spacing, and component feel, while adapting information architecture to the four-framework portal.
