import { NextResponse } from "next/server";
import {
  createDemoBusinessReport,
  type BusinessOpportunityReport,
} from "@/lib/implementation-lab";

type OpenAiResponse = {
  choices?: { message?: { content?: string } }[];
};

function normalizeUrl(input: string) {
  const raw = input.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  return {
    url: url.toString(),
    domain: url.hostname.replace(/^www\./i, ""),
  };
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

async function scrapeWithFirecrawl(url: string, apiKey: string) {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    data?: { markdown?: string; metadata?: Record<string, unknown> };
    markdown?: string;
    metadata?: Record<string, unknown>;
  };

  return {
    markdown: (json.data?.markdown || json.markdown || "").slice(0, 8000),
    metadata: json.data?.metadata || json.metadata || {},
  };
}

function buildAuditPrompt(args: {
  domain: string;
  url: string;
  email: string;
  scrape: { markdown: string; metadata: Record<string, unknown> } | null;
}) {
  return `You are an enterprise AI deployment strategist for UpSkill USA.

Generate an AI Opportunity Report for a business leader from this company website context.

Domain: ${args.domain}
URL: ${args.url}
Website metadata: ${JSON.stringify(args.scrape?.metadata || {})}
Website content:
${args.scrape?.markdown || "No scrape content available."}

Return ONLY valid JSON with this exact shape:
{
  "kind": "business",
  "companyName": string,
  "website": "${args.domain}",
  "email": "${args.email}",
  "industry": string,
  "sizeEstimate": string,
  "opportunityScore": number,
  "executiveSummary": string,
  "scoreRationale": string,
  "annualValueAtRisk": number,
  "fiveYearCostOfInaction": number,
  "employees": number,
  "addressableRoles": number,
  "weeklyHoursReclaimable": number,
  "annualHoursReclaimable": number,
  "fteEquivalent": number,
  "isDemo": false,
  "opportunities": [
    {
      "id": string,
      "department": string,
      "symptom": string,
      "estimatedAnnualHours": number,
      "pilotLabel": string,
      "aiAction": string,
      "humanReview": string
    }
  ]
}

Rules:
- Generate 3 to 4 opportunities.
- Name workflow pain, not generic AI features.
- Keep estimates conservative and directional.
- Do not promise layoffs, replacement, or guaranteed ROI.
- fteEquivalent = annualHoursReclaimable / 2080.`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { website?: unknown; email?: unknown };
    const websiteInput = typeof body.website === "string" ? body.website.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!websiteInput || !websiteInput.includes(".")) {
      return NextResponse.json({ ok: false, error: "Enter a valid company URL." }, { status: 400 });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }

    const { url, domain } = normalizeUrl(websiteInput);
    const openAiKey = process.env.OPENAI_API_KEY;
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;

    if (!openAiKey || !firecrawlKey) {
      return NextResponse.json({
        ok: true,
        report: createDemoBusinessReport(domain, email),
        source: "demo",
      });
    }

    const scrape = await scrapeWithFirecrawl(url, firecrawlKey);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You produce concise, defensible JSON business diagnostics for AI implementation planning.",
          },
          { role: "user", content: buildAuditPrompt({ domain, url, email, scrape }) },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Business audit failed (${response.status}): ${errorText.slice(0, 180)}`,
        },
        { status: 502 },
      );
    }

    const json = (await response.json()) as OpenAiResponse;
    const content = json.choices?.[0]?.message?.content || "";
    const report = parseJsonObject(content) as BusinessOpportunityReport;

    return NextResponse.json({
      ok: true,
      report: {
        ...report,
        kind: "business",
        website: domain,
        email,
        isDemo: false,
        fteEquivalent: Number(report.fteEquivalent) || (Number(report.annualHoursReclaimable) || 0) / 2080,
        opportunities: Array.isArray(report.opportunities) ? report.opportunities.slice(0, 4) : [],
      },
      source: "live",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown audit error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
