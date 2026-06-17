import { NextResponse } from "next/server";
import { defaultLanguage, languages, type Language } from "@/lib/content";
import {
  getWorkArea,
  normalizeEmployeeReport,
  workAreaKeys,
  type ImplementationTask,
  type ImplementationSummary,
  type EmployeeTransformationReport,
  type ImplementAudience,
  type ImplementWorkAreaKey,
} from "@/lib/implementation-lab";

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
};

type RoleAnalysisTask = Omit<ImplementationTask, "human_ownership"> & {
  human_ownership?: string;
};

type RoleAnalysis = {
  role: string;
  department: string;
  total_tasks_analyzed: number;
  summary: ImplementationSummary;
  tasks: RoleAnalysisTask[];
};

const reportLanguageName: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  pt: "Brazilian Portuguese",
};

const employeeReportTitles: Record<Language, { employee: string; business: string }> = {
  en: {
    employee: "Task Transformation Report",
    business: "Personal AI Readiness Report",
  },
  es: {
    employee: "Reporte de transformación de tareas",
    business: "Reporte personal de preparación para IA",
  },
  pt: {
    employee: "Relatório de transformação de tarefas",
    business: "Relatório pessoal de prontidão para IA",
  },
};

const humanOwnershipFallbacks: Record<Language, Record<"AUTOMATE" | "AUGMENT" | "OWN", string>> = {
  en: {
    AUTOMATE: "Human reviews exceptions and keeps final accountability.",
    AUGMENT: "Human reviews AI-prepared work and keeps judgment.",
    OWN: "Human owns the relationship, decision, and accountability.",
  },
  es: {
    AUTOMATE: "La persona revisa excepciones y conserva la responsabilidad final.",
    AUGMENT: "La persona revisa el trabajo preparado por IA y conserva el juicio.",
    OWN: "La persona conserva la relación, la decisión y la responsabilidad.",
  },
  pt: {
    AUTOMATE: "A pessoa revisa exceções e mantém a responsabilidade final.",
    AUGMENT: "A pessoa revisa o trabalho preparado por IA e mantém o julgamento.",
    OWN: "A pessoa mantém a relação, a decisão e a responsabilidade.",
  },
};

const EMPLOYEE_ANALYSIS_SYSTEM_PROMPT = `You are an expert organizational designer and AI transformation consultant with deep knowledge of corporate structures, workforce automation, and human-AI collaboration frameworks.

## YOUR MISSION

Given a corporate job role, you will:
1. Generate a comprehensive list of common tasks performed in that role
2. Analyze each task and classify it into one of three buckets: AUTOMATE, AUGMENT, or OWN
3. Return structured JSON data with time savings estimates and justifications

---

## STEP 1 - TASK GENERATION

For the given role, generate 10-20 realistic, specific tasks that professionals in this role perform daily, weekly, or monthly. Tasks should span:
- Data entry and processing
- Communication and coordination
- Analysis and reporting
- Decision-making and judgment calls
- Compliance and oversight
- Relationship management

---

## STEP 2 - CLASSIFICATION FRAMEWORK

Classify each task into exactly one of these three buckets:

### AUTOMATE
Definition: Tasks that can be fully handled by AI/software with no human involvement needed.
Criteria:
  - Highly repetitive and rule-based
  - Structured data inputs and predictable outputs
  - No nuanced judgment, empathy, or ethical reasoning required
  - Error-prone when done manually at scale
  - High volume, low complexity
Examples: Data entry, invoice matching, generating standard reports, sending templated emails, reconciliation of transactions, flagging anomalies via rules

### AUGMENT
Definition: Tasks where AI assists the human, making them faster, more accurate, or better informed, but a human retains meaningful involvement and final judgment.
Criteria:
  - Requires human interpretation, context, or relationship awareness
  - AI can draft, suggest, analyze, or surface insights
  - Output quality improves significantly with AI assistance
  - Human oversight adds compliance, accountability, or nuance
  - Moderate complexity with variable inputs
Examples: Drafting dispute resolution emails, prioritizing collections calls, summarizing aging reports for leadership, forecasting cash flow

### OWN
Definition: Tasks that must remain fully human-led. AI may provide background data, but humans drive and own the process, relationships, and decisions.
Criteria:
  - High emotional intelligence or interpersonal sensitivity required
  - Involves legal, ethical, or strategic accountability
  - Requires organizational trust, authority, or negotiation
  - Outcomes significantly affect people, clients, or regulatory standing
  - Low repeatability, high context-dependence
Examples: Negotiating payment terms with key clients, handling escalated disputes, presenting financial risk to executives, mentoring team members

---

## STEP 3 - TIME SAVINGS ESTIMATION METHODOLOGY

For AUTOMATE tasks, estimate time savings using this formula:
  - Baseline: Average minutes/hours a human spends on this task per instance
  - Frequency: How often the task occurs
  - Automation rate: 85-100% time reduction for full automation
  - Monthly hours saved = (time per instance * frequency per month) * automation rate

For AUGMENT tasks:
  - Automation rate: 30-65% time reduction
  - Factor in drafting speed, error reduction, and fewer revision cycles

For OWN tasks:
  - Automation rate: 0-15%
  - Note any AI-assisted prep work that reduces burden

Use industry benchmarks where applicable:
  - Manual invoice processing: about 15-20 min/invoice
  - Collections call prep: about 10-15 min/account
  - Monthly close reconciliation: about 2-4 hours
  - Report generation: about 1-3 hours
  - Email response, complex: about 10-20 min

---

## BEHAVIOR RULES

- Always generate tasks BEFORE classifying. Do not skip task generation.
- Be specific: avoid vague tasks like "manages data"; say "reconciles daily payment postings against bank statements".
- Never classify a task as AUTOMATE if it involves legal signing authority, client relationship ownership, or ethical judgment.
- If a task could fit two buckets, choose the more conservative, human-forward option and note it in the rationale.
- Monthly hours saved must be mathematically consistent: (avg_minutes_per_instance * instances_per_month / 60) * (automation_rate_pct / 100).
- estimated_fte_equivalent_saved assumes 160 working hours/month.
- confidence reflects how certain the estimate is based on task standardization.
- tools_suggested should name real AI/automation tools, such as UiPath, Copilot, GPT-4, Salesforce Einstein, Bill.com, Tesseract OCR, Zapier, or Power Automate.

Return ONLY valid JSON. No prose. No markdown. No emojis.`;

const roleAnalysisSchema = {
  type: "object",
  required: ["role", "department", "total_tasks_analyzed", "summary", "tasks"],
  properties: {
    role: { type: "string" },
    department: { type: "string" },
    total_tasks_analyzed: { type: "number" },
    summary: {
      type: "object",
      required: [
        "automate_count",
        "augment_count",
        "own_count",
        "estimated_monthly_hours_saved",
        "estimated_fte_equivalent_saved",
      ],
      properties: {
        automate_count: { type: "number" },
        augment_count: { type: "number" },
        own_count: { type: "number" },
        estimated_monthly_hours_saved: { type: "number" },
        estimated_fte_equivalent_saved: { type: "number" },
      },
    },
    tasks: {
      type: "array",
      items: {
        type: "object",
        required: [
          "task_id",
          "task_name",
          "description",
          "frequency",
          "avg_minutes_per_instance",
          "instances_per_month",
          "bucket",
          "rationale",
          "ai_action",
          "automation_rate_pct",
          "monthly_hours_saved",
          "confidence",
          "tools_suggested",
        ],
        properties: {
          task_id: { type: "number" },
          task_name: { type: "string" },
          description: { type: "string" },
          frequency: { type: "string", enum: ["daily", "weekly", "monthly", "ad-hoc"] },
          avg_minutes_per_instance: { type: "number" },
          instances_per_month: { type: "number" },
          bucket: { type: "string", enum: ["AUTOMATE", "AUGMENT", "OWN"] },
          rationale: { type: "string" },
          ai_action: { type: "string" },
          automation_rate_pct: { type: "number" },
          monthly_hours_saved: { type: "number" },
          confidence: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          tools_suggested: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

function isWorkArea(value: unknown): value is ImplementWorkAreaKey {
  return typeof value === "string" && workAreaKeys.includes(value as ImplementWorkAreaKey);
}

function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1]?.trim() || trimmed;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI returned no JSON object");
  }
  return JSON.parse(source.slice(start, end + 1));
}

function isAudience(value: unknown): value is ImplementAudience {
  return value === "business" || value === "employee";
}

function parseLanguage(value: unknown): Language {
  return typeof value === "string" && languages.includes(value as Language)
    ? (value as Language)
    : defaultLanguage;
}

function buildUserMessage(
  workArea: ImplementWorkAreaKey,
  tasks: string[],
  audience: ImplementAudience,
  language: Language,
) {
  const area = getWorkArea(workArea);
  const isLeader = audience === "business";
  const role = isLeader ? `${area.category} business leader` : `${area.category} professional`;

  return [
    `Analyze this role: ${role}`,
    "",
    `Department: ${area.category}`,
    `Focus: ${area.focus}`,
    "",
    "The employee has confirmed the following skills/responsibilities as their day-to-day work. Anchor your generated tasks to these; every skill below should map to at least one concrete task in your output:",
    ...tasks.map((task) => `- ${task}`),
    "",
    "Treat this skill list as ground truth for what this person actually does. Do not invent tasks unrelated to these skills, but you may add 2-4 supporting/adjacent tasks that naturally co-occur.",
    "",
    `Write all user-facing string values in ${reportLanguageName[language]}. Keep JSON keys, enum values, numbers, and internal identifiers in English exactly as the schema defines them.`,
    "",
    "Return between 10 and 20 tasks total.",
  ].join("\n");
}

function humanOwnershipForTask(task: RoleAnalysisTask, language: Language) {
  if (task.human_ownership) return task.human_ownership;
  return humanOwnershipFallbacks[language][task.bucket];
}

function toEmployeeReport(
  analysis: RoleAnalysis,
  workArea: ImplementWorkAreaKey,
  tasksRequested: number,
  audience: ImplementAudience,
  language: Language,
): EmployeeTransformationReport {
  return normalizeEmployeeReport({
    kind: "employee",
    title: employeeReportTitles[language][audience],
    workArea,
    skillsAnalyzed: tasksRequested,
    summary: analysis.summary,
    tasks: analysis.tasks.map((task) => ({
      ...task,
      human_ownership: humanOwnershipForTask(task, language),
    })),
    tools: [],
  });
}

function geminiError(status: number, body: string) {
  if (status === 400 && body.includes("API_KEY_INVALID")) {
    return "Gemini API key is invalid. Check GEMINI_API_KEY in this environment and redeploy.";
  }
  if (status === 400 && body.includes("models/")) {
    return `Gemini model request failed. ${body.slice(0, 240)}`;
  }
  if (status === 429) return "Gemini rate limit reached. Please wait a moment and try again.";
  return `Gemini error ${status}: ${body.slice(0, 300)}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      workArea?: unknown;
      tasks?: unknown;
      customTasks?: unknown;
      audience?: unknown;
      language?: unknown;
    };
    const workArea = isWorkArea(body.workArea) ? body.workArea : undefined;
    const audience = isAudience(body.audience) ? body.audience : "employee";
    const language = parseLanguage(body.language);
    const selectedTasks = Array.isArray(body.tasks)
      ? body.tasks.filter((task): task is string => typeof task === "string" && task.trim().length > 0)
      : [];
    const customTasks = Array.isArray(body.customTasks)
      ? body.customTasks.filter((task): task is string => typeof task === "string" && task.trim().length > 0)
      : [];
    const tasks = [...selectedTasks, ...customTasks].slice(0, 24);

    if (!workArea || tasks.length < 3) {
      return NextResponse.json(
        { ok: false, error: "Choose a work area and at least three tasks." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "GEMINI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const model = process.env.GEMINI_EMPLOYEE_MODEL || "gemini-2.5-flash";
    const prompt = [
      EMPLOYEE_ANALYSIS_SYSTEM_PROMPT,
      "",
      buildUserMessage(workArea, tasks, audience, language),
    ].join("\n\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: roleAnalysisSchema,
          },
        }),
      },
    );

    if (!response.ok) {
      const bodyText = await response.text();
      const error = geminiError(response.status, bodyText);
      console.error("analyze-employee-tasks Gemini request failed:", error);
      return NextResponse.json({ ok: false, error }, { status: 502 });
    }

    let report: EmployeeTransformationReport;
    try {
      const json = (await response.json()) as GeminiResponse;
      const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
      if (!text) throw new Error("AI returned no structured output.");
      const parsed = parseJsonObject(text) as RoleAnalysis;
      report = toEmployeeReport(parsed, workArea, tasks.length, audience, language);
    } catch (caughtError) {
      const error = caughtError instanceof Error ? caughtError.message : "AI returned invalid structured output.";
      console.error("analyze-employee-tasks parse failed:", error);
      return NextResponse.json({ ok: false, error }, { status: 502 });
    }

    return NextResponse.json({ ok: true, report, source: "gemini" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown analysis error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
