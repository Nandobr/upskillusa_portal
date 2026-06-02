# UpSkill USA MVP Design System

## Source And Intent

This MVP should feel like a polished informational portal with light demo widgets, not a production SaaS dashboard. Use the DOCX as the content source of truth and the Lovable reference as the visual direction: deep navy surfaces, royal-blue action states, gold accents, elegant enterprise cards, pill navigation, strong metric blocks, and Lucide-style icons.

The portal journey is the product: Inspire -> Learn -> Adapt -> Implement. Navigation, page hierarchy, and calls to action should always preserve that sequence.

## Palette

- `navy-950` `#071326`: primary background, header, footer, dark hero bands.
- `navy-900` `#0B1F3A`: elevated dark sections and large intro panels.
- `blue-700` `#1E56D8`: primary actions, selected navigation, links.
- `blue-500` `#3B82F6`: hover states, secondary emphasis, focus rings.
- `gold-500` `#F2B84B`: UpSkill accent, step numbers, highlight rules.
- `gold-100` `#FFF4D6`: soft highlight backgrounds.
- `slate-900` `#172033`: primary text on light surfaces.
- `slate-600` `#5D6B82`: secondary body text.
- `slate-100` `#EEF3F8`: page background and quiet section bands.
- `white` `#FFFFFF`: cards and text on dark surfaces.

Use navy as the brand anchor, blue for clear interaction, and gold sparingly for sequence and optimism. Avoid screens dominated by only one hue.

## Typography

- Prefer a clean geometric sans stack: `Inter`, `Geist`, `Aptos`, `system-ui`, sans-serif.
- Hero headlines should be confident and concise, with normal letter spacing.
- Body copy should stay practical and skimmable. Avoid long manifesto blocks in UI.
- Use short eyebrow labels for the framework question: "What's your gift?", "How do you learn?", "How do you adapt?", "How do you innovate?"

## Layout

- Keep a sticky header with the UpSkill USA mark, ordered framework navigation, and `EN / ES / PT` language toggle.
- Use full-width bands for major page sections. Do not nest cards inside cards.
- First viewport should make the brand, four-framework arc, and next action immediately visible.
- Use responsive grids that collapse to a single column on mobile.
- Fixed-format widgets such as prompt grids, plan summaries, audit findings, and workflow steps should have stable spacing and avoid layout shift.

## Components

- Navigation: pill-style tabs in the order `Inspire`, `Learn`, `Adapt`, `Implement`.
- Buttons: icon plus text where possible; use Lucide icons for arrows, play, calendar, building, workflow, check, and globe.
- Cards: radius no larger than `8px`, subtle border, restrained shadow, generous but not oversized padding.
- Step cards: include number, title, one-sentence description, and owner/status when relevant.
- Demo widgets: use form controls, disabled/empty states, generated preview panels, and a visible "Demo content" label.
- Metrics: present as compact facts, not oversized marketing counters. Prefer verified DOCX figures such as `22% of jobs disrupted by 2030`.

## Content Rules

- Core copy should be DOCX-derived and concise.
- Dynamic outputs must be labeled as local demo/mock content.
- Do not imply real AI generation, real company URL scanning, persistence, event registration, credential verification, or employment guarantees.
- Use the promise carefully: "We don't fire. We upgrade." Treat it as the portal's aspirational stance, not a legal guarantee.
- For statistics, prefer the DOCX corrections: `22% of jobs disrupted by 2030`, not `40%`.
- EN, ES, and PT copy can be MVP draft translation; flag it for human review before launch.

## Page Direction

- Overview: introduce "One Portal. Four Frameworks." and the Gift -> Learn -> Adapt -> Innovate arc.
- Inspire: emotional entry point with IKIGAI prompts and the dignity reframe.
- Learn: two learning channels, AI tool library, and custom GPT role preparation.
- Adapt: Saturday seminar, employer/employee alignment, and five-year plan builder.
- Implement: bottom-up workflow builder, mock audit, human review gates, and installer-agent concept.

## Accessibility And Responsiveness

- Maintain visible focus states for interactive controls.
- Keep text readable on dark backgrounds with high contrast.
- Do not rely on color alone for selected states or demo labels.
- Ensure nav, forms, and generated summaries work on mobile without horizontal scrolling.
- Validate pages at desktop and mobile widths before considering UI work complete.
