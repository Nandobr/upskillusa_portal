# Step 4 — IMPLEMENT Redesign Spec

**Status:** Planning — not yet implemented
**Reference repo:** github.com/BTCompKSU/autonomous-enterprise-platform
**UI reference:** Reference repo Step 2 (white card panels on dark navy background, gold chip toggles)

---

## What changes

| File | Action | Why |
|------|--------|-----|
| `src/app/api/analyze-workflow/route.ts` | CREATE | Next.js API route calling Gemini — equivalent to reference repo's `createServerFn` |
| `src/lib/workflow-analysis.ts` | CREATE | Types (`WorkflowTask`, `WorkflowAnalysis`), system prompt adapted for workflow context, JSON schema for Gemini tool call |
| `src/lib/plan.ts` | MODIFY | Extend `ImplementPlanInput` to store `analysis` result and `selectedPilotTaskIds[]` |
| `src/components/portal-pages.tsx` | MODIFY | Replace `ImplementDemo` (4 form fields + checkboxes) with new 5-phase component |
| `src/app/globals.css` | MODIFY | Add CSS classes for dark KPI hero row, white analysis cards, gold chip toggles, task row bars, bucket badges |
| `.env.local` | MANUAL | Add `GEMINI_API_KEY=...` — added by user |

---

## JTBD User Journey

**Context:** User arrives at `/implement` after completing ADAPT, which has already saved:
- `workCategory` — e.g., "customer-support"
- `workflowPain` — free-text description of the workflow that takes too long
- `mainSteps` — ordered steps of the current workflow
- `delay` — where people wait
- `repetitiveWork` — what is repetitive
- `judgmentNeeds` — what requires human judgment
- `own` + `become` — aspirational framing

### Phase 0 — Guard
- No Adapt data → show prompt "Complete Step 3: Adapt first" with link to `/adapt`

### Phase 1 — Workflow Preview
- White card summarizing Adapt data (workCategory + workflowPain)
- "Analyze My Workflow" button triggers the AI call

### Phase 2 — Loading (maps to reference `LoadingPhase`)
Animated 4-step checklist:
1. "Mapping your workflow steps…"
2. "Classifying tasks: Automate / Augment / Own…"
3. "Calculating monthly hours saved…"
4. "Building your pilot plan…"
+ Rotating UpSkill USA fact chips (e.g., "Teams using AI augmentation recover 8+ hrs/week on average")

### Phase 3 — AI Analysis Report (maps to reference `ReportPhase`)
- **Header card:** Workflow name, work category, tasks analyzed, readiness band
- **KPI hero row** (dark navy `#0B1F3B`): hours saved/month, FTE equivalent, automation %
- **Bucket tile counts:** Automate / Augment / Own
- **Task-by-task breakdown:** Per-task rows with bucket badge (AUTOMATE/AUGMENT/OWN), before/after hour progress bar, "AI does:" description text
- **Recommended AI tools grid:** Chip list of tools suggested across tasks

### Phase 4 — Pilot Setup (chip-toggle style from reference Step 2)
- "Select tasks for your first pilot" — chip toggles over AUTOMATE tasks (white card, gold selected state)
- Human review gate text input
- All 5 safety checkboxes (unchanged from current UpSkill USA app), re-styled as white card:
  - Could this affect jobs, pay, benefits, education, or access?
  - Does this use sensitive personal or company data?
  - Could a wrong answer harm someone or the business?
  - Would someone need to explain how the decision was made?
  - Can a person correct or appeal the result?

### Phase 5 — Save
- "Save and View Complete Plan" → persists to localStorage → navigates to `/plan`

---

## AI Call — Gemini

**Model:** `gemini-2.0-flash` (free tier, direct API)
**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
**Pattern:** Tool call with structured output schema (same approach as reference repo)

### User message input
```
Analyze this workflow: [workCategory] professional

Pain point: [workflowPain]
Current steps: [mainSteps]
Where delays happen: [delay]
Repetitive work: [repetitiveWork]
Judgment-heavy parts: [judgmentNeeds]
Goal: [own] → [become]

Generate 8–15 tasks grounded in the workflow described above.
Classify each task into AUTOMATE / AUGMENT / OWN.
```

### System prompt
Adapted from the reference repo's `SYSTEM_PROMPT` — same AUTOMATE/AUGMENT/OWN classification framework and time-savings estimation methodology, re-framed for a specific workflow rather than a general job role.

### Output schema (`WorkflowAnalysis`)
Mirrors reference repo's `RoleAnalysis` / `RoleTask` types:
```typescript
type TaskBucket = "AUTOMATE" | "AUGMENT" | "OWN";

type WorkflowTask = {
  task_id: number;
  task_name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "ad-hoc";
  avg_minutes_per_instance: number;
  instances_per_month: number;
  bucket: TaskBucket;
  rationale: string;
  ai_action: string;
  automation_rate_pct: number;
  monthly_hours_saved: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  tools_suggested: string[];
};

type WorkflowAnalysis = {
  workflow: string;
  category: string;
  total_tasks_analyzed: number;
  summary: {
    automate_count: number;
    augment_count: number;
    own_count: number;
    estimated_monthly_hours_saved: number;
    estimated_fte_equivalent_saved: number;
  };
  tasks: WorkflowTask[];
};
```

---

## Design Language

Taken from reference Step 2 (chip grid) + Step 3 (report):

| Element | Style |
|---------|-------|
| KPI hero row | Dark navy `#0B1F3B` background, white text, gold `#F5C84C` stat labels |
| White analysis cards | `background: white`, `box-shadow: 0 20px 60px -15px rgba(0,0,0,0.5)`, `border-radius: 16px` |
| AUTOMATE badge | Navy `#0B1F3B` bg, white text |
| AUGMENT badge | Emerald bg (`#d1fae5`), dark green text |
| OWN badge | Gold `#F5C84C` bg tint, dark gold text |
| Chip (unselected) | White bg, `border: 1px solid #e2e8f0`, slate text |
| Chip (selected) | Gold `#F5C84C` bg, navy text, `font-weight: 600` |
| CTA button | Gold `#F5C84C` bg, navy text |
| Loading spinner | Navy `#0B1F3B` |

---

## What stays the same

- `PlanProvider` / localStorage architecture — no changes
- `generateUpgradePlan()` — the "First Workflow Pilot" plan section uses the updated `ImplementPlanInput` fields
- All 3 languages (en/es/pt) in `content.ts` — no new content keys needed (analysis output is English from Gemini)
- The `/plan` page — unaffected
- Steps 1–3 (Inspire, Learn, Adapt) — unaffected

---

## Decisions locked

1. **Safety checkboxes:** Keep all 5 from the current UpSkill USA app, re-styled with the new white-card design.
2. **Gemini API key:** `.env.local` must be created at the project root with `GEMINI_API_KEY=...`. File doesn't exist yet — user creates it manually. Free key at aistudio.google.com/apikey.
3. **AI provider:** Google Gemini (`gemini-2.0-flash`, direct API — no Lovable gateway).
4. **UI reference:** Reference repo Step 2 chip-grid + Step 3 report card design language.
