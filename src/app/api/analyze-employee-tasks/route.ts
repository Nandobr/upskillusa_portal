import { NextResponse } from "next/server";
import {
  buildEmployeeFallbackReport,
  getWorkArea,
  normalizeEmployeeReport,
  workAreaKeys,
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

function buildPrompt(workArea: ImplementWorkAreaKey, tasks: string[], audience: ImplementAudience) {
  const area = getWorkArea(workArea);
  const isLeader = audience === "business";
  const reportTitle = isLeader ? "Personal AI Readiness Report" : "Task Transformation Report";
  const audienceContext = isLeader
    ? "a business leader's personal responsibilities, leadership work, and decision workflows"
    : "an employee's work tasks and daily responsibilities";

  return `You are an UpSkill USA AI implementation analyst.

Analyze ${audienceContext}.

Work area: ${area.category}
Focus: ${area.focus}

Selected tasks/responsibilities:
${tasks.map((task) => `- ${task}`).join("\n")}

Generate a practical ${reportTitle}.

Classify each task into exactly one bucket:
- AUTOMATE: repetitive/rules-based; AI can handle most work with exception review.
- AUGMENT: AI drafts, summarizes, analyzes, or prepares; human keeps judgment.
- OWN: human-led work involving trust, accountability, ethics, leadership, or relationship ownership.

Return ONLY valid JSON with this exact shape:
{
  "kind": "employee",
  "title": "${reportTitle}",
  "workArea": "${area.category}",
  "skillsAnalyzed": ${tasks.length},
  "summary": {
    "automate_count": number,
    "augment_count": number,
    "own_count": number,
    "estimated_monthly_hours_saved": number,
    "estimated_fte_equivalent_saved": number
  },
  "tasks": [
    {
      "task_id": number,
      "task_name": string,
      "description": string,
      "frequency": "daily" | "weekly" | "monthly" | "ad-hoc",
      "avg_minutes_per_instance": number,
      "instances_per_month": number,
      "bucket": "AUTOMATE" | "AUGMENT" | "OWN",
      "rationale": string,
      "ai_action": string,
      "human_ownership": string,
      "automation_rate_pct": number,
      "monthly_hours_saved": number,
      "confidence": "HIGH" | "MEDIUM" | "LOW",
      "tools_suggested": string[]
    }
  ],
  "tools": string[]
}

Tool guidance:
- "tools_suggested" should name real AI/automation tools, not generic categories.
- Use realistic options such as UiPath, Microsoft Copilot, ChatGPT Enterprise, GPT-4, Claude, Salesforce Einstein, Bill.com, Tesseract OCR, Zapier, Power Automate, Make, ServiceNow AI, GitHub Copilot, Databricks Assistant, Workday AI, Harvey, Spellbook, or similar department-appropriate tools.
- Return a useful "tools" list summarizing the strongest recommended tools across tasks.

Generate exactly 15 tasks when possible. Keep all estimates conservative. Monthly hours saved must be mathematically plausible. Prefer a mix close to 3 AUTOMATE tasks, 8 AUGMENT tasks, and 4 OWN tasks unless the selected responsibilities clearly require a different split.`;
}

function employeeFallbackResponse(
  workArea: ImplementWorkAreaKey,
  tasks: string[],
  audience: ImplementAudience,
  source = "demo",
) {
  const report = buildEmployeeFallbackReport(workArea, tasks);
  return NextResponse.json({
    ok: true,
    report: {
      ...report,
      title: audience === "business" ? "Personal AI Readiness Report" : "Task Transformation Report",
    },
    source,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      workArea?: unknown;
      tasks?: unknown;
      customTasks?: unknown;
      audience?: unknown;
    };
    const workArea = isWorkArea(body.workArea) ? body.workArea : undefined;
    const audience = isAudience(body.audience) ? body.audience : "employee";
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
      return employeeFallbackResponse(workArea, tasks, audience);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: buildPrompt(workArea, tasks, audience) }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      return employeeFallbackResponse(workArea, tasks, audience, "fallback");
    }

    let report: EmployeeTransformationReport;
    try {
      const json = (await response.json()) as GeminiResponse;
      const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
      const parsed = parseJsonObject(text) as EmployeeTransformationReport;
      report = normalizeEmployeeReport({
        ...parsed,
        kind: "employee",
        title: audience === "business" ? "Personal AI Readiness Report" : parsed.title || "Task Transformation Report",
        workArea,
        skillsAnalyzed: tasks.length,
      });
    } catch {
      return employeeFallbackResponse(workArea, tasks, audience, "fallback");
    }

    return NextResponse.json({ ok: true, report, source: "gemini" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown analysis error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
