# AI Upgrade Plan Builder - Summary And Key Takeaways

Prepared for the UpSkill USA MVP.

This document summarizes the explore conversation that shaped the progressive four-step AI Upgrade Plan Builder.

## Core Decision

The AI Upgrade Plan Builder is not a separate fifth feature. It is the interactive output of the existing four-step framework.

```text
/inspire   -> Level 1: Opportunity Seed
/learn     -> Level 2: Learning Path
/adapt     -> Level 3: AI Opportunity Draft
/implement -> Level 4: Complete AI Upgrade Plan
/plan      -> Plan so far or final plan
```

## Why We Planned This Change

The original app had four useful pages, each with its own form or demo. The issue was that the forms were isolated. A user could complete Inspire, Learn, Adapt, and Implement, but the app did not combine those answers into a meaningful final output.

The planning conversation reframed the product: the four pages should stay central, but each page should contribute a section to one shared AI Upgrade Plan.

## Key Takeaways

- **The four steps are the product framework.** The plan builder should not replace Inspire, Learn, Adapt, and Implement. It should make those steps actionable.
- **Users may not have every answer upfront.** The product should give value at every level, not only after all four pages are complete.
- **Every plan needs momentum.** Partial plans should include a next 3 days section. Complete plans should include a next 7 days section plus after-7-days options.
- **MVP output should be deterministic.** The first version should use local templates, simple rules, and browser storage. No AI API, no backend, no database, and no real audit.
- **Safety belongs inside the workflow.** A plain-language, NIST-inspired checklist gives the plan a responsible AI backbone without forcing users through a heavy compliance process.

## Minimum Useful User Inputs

| Framework Step | Minimum Inputs | Plan Output |
| --- | --- | --- |
| Inspire | User type, role, organization/context, motivation, desired outcome, human strengths | Opportunity Seed: why AI matters for this person and what human value must be protected |
| Learn | User track, AI comfort level, time available, learning preference | Learning Path: practical next learning resource direction matched to readiness |
| Adapt | Work category, workflow pain, steps, delay, repetitive work, judgment needs, ownership, future role | AI Opportunity Draft: where AI can assist, what should remain human-led, and what the user will become |
| Implement | Pilot workflow, pilot scope, human review gate, safety checklist answers | Complete AI Upgrade Plan: first pilot, risk level, review gate, next 7 days, and after-7-days path |

## How The Four Steps Connect

The planning conversation clarified the relationship between the existing pages and the new plan output:

- **Framework pages:** the curriculum and guided input surfaces.
- **Plan state:** the local workbook that accumulates answers.
- **`/plan`:** the plan so far, or the final AI Upgrade Plan once all four steps are complete.

```text
Inspire inputs
+ Learn inputs
+ Adapt inputs
+ Implement inputs
= AI Upgrade Plan
```

## Framework Choice For MVP

We compared two approaches for the consulting-style backbone.

| Option | Summary | Decision |
| --- | --- | --- |
| Option 1 | Original APQC-inspired categories, simple process mapping questions, and NIST-inspired safety checks | Chosen for MVP because it is fastest, simple to explain, and requires no external dataset import |
| Option 2 | O*NET, Simple Process Mapping, Canada AIA-lite, and EU ALTAI-lite | Better for a later version because it is more rigorous but needs occupation matching, attribution, and more logic |

The MVP framework is intentionally lightweight:

```text
Classify work area
-> Map workflow friction
-> Identify AI assist opportunity
-> Add human review gate
-> Generate next 3 days or next 7 days
```

## Plan Completeness Levels

| Level | When It Appears | User Value |
| --- | --- | --- |
| Level 1: Opportunity Seed | After Inspire | The user sees their role, goal, motivation, and human strengths reflected back |
| Level 2: Learning Path | After Learn | The user gets a readiness-matched learning direction and next 3 days |
| Level 3: AI Opportunity Draft | After Adapt | The user gets a workflow adaptation plan based on pain, delay, repetition, and judgment |
| Level 4: Complete AI Upgrade Plan | After Implement | The user gets a pilot plan, safety/risk level, human review gate, next 7 days, and after-7-days options |

## Momentum After The Plan

The end of the plan must answer “what next?” Every learner needs a concrete next goal after the first sprint.

### Partial Plans

- Show next 3 days.
- Send the user back to the next framework step.
- Keep the portal journey active instead of ending the experience too early.

### Complete Plans

- Show next 7 days.
- End with three paths: Learn More, Run A Bigger Pilot, or Get Help Implementing.
- Make the post-pilot decision explicit: expand, revise, or stop.

## MVP Boundaries

- No GitHub commit or push was made.
- No AI API is used for the first version.
- No backend or database is required.
- Plan progress is saved only in the user's browser.
- Dynamic output is local MVP guidance, not a real audit or verified ROI calculation.
- External frameworks are used as inspiration, not copied as imported data tables.

## Practical Product Decision

The strongest product decision from the planning process was to keep the four framework pages and make them progressively useful. This preserves the UpSkill USA narrative while giving users a tangible deliverable.

Final framing:

```text
The four pages are the journey.
The AI Upgrade Plan is the completed workbook.
The /plan page is where the user sees what they have built so far.
```
