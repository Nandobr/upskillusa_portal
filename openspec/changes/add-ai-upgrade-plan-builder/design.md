## Context

The current MVP is a public Next.js portal with five routes: overview plus Inspire, Learn, Adapt, and Implement. Each framework page contains a client-side demo, but the demos are independent and do not accumulate into a final user outcome. The desired product direction is to keep the four pages central while making them behave like a progressive workbook that produces an AI Upgrade Plan.

The MVP constraints remain unchanged: no authentication, database, backend persistence, real AI generation, real company URL scanning, event registration, or CRM integration. The design must follow `DESIGN.md`, preserve the ordered four-framework navigation, and keep EN/ES/PT copy aligned with the existing language content model where feasible.

## Goals / Non-Goals

**Goals:**

- Keep `/inspire`, `/learn`, `/adapt`, and `/implement` as the user's primary journey.
- Update the page forms so they collect the minimum useful data for progressive plan generation.
- Add `/plan` as a plan-so-far and final-plan summary route.
- Save the user's plan draft locally in the browser for MVP continuity across pages.
- Generate deterministic plan text from templates and rules.
- Provide plan completeness levels, next 3 days/next 7 days guidance, and after-7-days momentum options.
- Allow users to copy the generated plan as text and download it through the browser print-to-PDF flow.

**Non-Goals:**

- No AI API calls or dynamic LLM generation.
- No backend API, database schema, authentication, or user accounts.
- No real audit, ROI calculation, or workflow deployment.
- No external taxonomy import, APQC data copy, O*NET matching, Canada AIA import, or EU ALTAI import for this MVP.
- No contact form persistence or CRM integration.

## Decisions

### Decision: Keep The Four Framework Pages As The Input Journey

The product should not introduce `/plan` as a separate wizard that bypasses the four-step framework. Instead, each existing framework page owns one section of the plan draft, and `/plan` summarizes whatever has been completed.

Alternative considered: build all inputs inside a standalone `/plan` wizard. This would be simpler technically, but it weakens the core product story because the four framework pages become explanatory side pages rather than the user's actual path.

### Decision: Use Local Browser Storage For MVP Plan Progress

Store the draft plan in client-side state with localStorage persistence. This lets users move across framework pages and revisit `/plan` without introducing backend complexity.

Alternative considered: keep all plan state in memory only. This would be easier, but page refreshes would lose progress and make the multi-page flow fragile.

### Decision: Use Deterministic Rules And Templates

Generate plan sections from structured inputs, category metadata, workflow patterns, learning recommendations, safety checklist answers, and fixed templates. This keeps the MVP transparent and avoids implying real AI generation.

Alternative considered: use an LLM to generate richer plans. That may be valuable later, but it requires API integration, prompt safety, cost control, and stronger content disclaimers.

### Decision: Use Original Lightweight Categories

Use original work categories such as Customer Support, Sales and Marketing, Human Resources, Finance and Administration, Operations, Training and Education, IT and Data, and Leadership and Strategy. These are APQC-inspired in spirit but not copied from APQC.

Alternative considered: import an external taxonomy such as APQC or O*NET. That adds data licensing, matching, attribution, and maintenance work that is not necessary for the MVP.

### Decision: Use Plain-Language NIST-Inspired Safety Questions

Use short safety questions that check impact, sensitive data, potential harm, explainability, human review, and correction/appeal. The output should assign low, medium, or high risk and recommend an appropriate human review gate.

Alternative considered: implement the full NIST AI RMF or another full AI risk questionnaire. That would be too heavy for the first user-facing flow.

### Decision: Partial Plans Must Be Useful

Every plan level should include next actions. Partial plans include a next 3 days section and a CTA to continue the next framework step. Complete plans include a next 7 days section and an "After 7 Days: Choose Your Next Move" section.

Alternative considered: only generate a plan after Implement. That would make the product less useful for visitors who do not have all answers yet.

### Decision: Plan Download Uses Print-To-PDF

The `/plan` download action should print only the final plan document, not the sidebar, navigation, or page shell. Copy remains text-based.

Alternative considered: continue downloading plain text. That is simpler, but it does not match the report-style artifacts used elsewhere in the portal.

## Risks / Trade-offs

- **Plan feels generic** -> Use role, workflow category, workflow pain, outcome, AI comfort, and risk answers in templates so the output reflects user input.
- **Users confuse template output for real AI advice** -> Label the plan as a local MVP plan and keep risk/ROI claims conservative.
- **localStorage creates privacy concerns** -> Store only in the user's browser, avoid sensitive data prompts, and provide a clear reset/clear action.
- **Four pages become too form-heavy** -> Keep the minimum useful inputs per page and preserve the explanatory content around each step.
- **Multilingual content grows quickly** -> Keep plan-builder copy concise and colocated with the existing content model.
- **Risk checklist oversimplifies responsible AI** -> Present the output as a first-pass safety screen and require human review for medium/high impact workflows.
