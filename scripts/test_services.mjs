#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = new Set(process.argv.slice(2));
const sendEmailIndex = process.argv.indexOf("--send-email");
const emailRecipient = sendEmailIndex >= 0 ? process.argv[sendEmailIndex + 1] : "";
const liveWrite = args.has("--live-write");

loadDotEnvLocal();

const checks = [];

await runCheck("Environment", checkEnvironment);
await runCheck("Supabase REST", checkSupabaseRest);
await runCheck("Supabase lead RPC", checkSupabaseRpc);
await runCheck("Firecrawl scrape", checkFirecrawl);
await runCheck("The Companies API", checkCompaniesApi);
await runCheck("Gemini business audit model", checkGeminiAudit);
await runCheck("Gemini employee model", checkGeminiEmployeeCovered);
await runCheck("Resend account", checkResend);
await runCheck("Resend send", checkResendSend);

const failed = checks.filter((check) => check.status === "fail");
const warned = checks.filter((check) => check.status === "warn");

console.log("\nService check summary");
console.log("=====================");
for (const check of checks) {
  const icon = check.status === "pass" ? "PASS" : check.status === "warn" ? "WARN" : "FAIL";
  console.log(`${icon} ${check.name}: ${check.message}`);
}

if (failed.length > 0) {
  console.log(`\n${failed.length} required check(s) failed.`);
  process.exit(1);
}

if (warned.length > 0) {
  console.log(`\nCompleted with ${warned.length} warning(s).`);
  process.exit(0);
}

console.log("\nAll configured services passed.");

async function runCheck(name, fn) {
  try {
    const result = await fn();
    checks.push({ name, status: result.status ?? "pass", message: result.message });
  } catch (error) {
    checks.push({
      name,
      status: "fail",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function loadDotEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  let contents = "";
  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = unquote(rawValue.trim());
  }
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function present(key) {
  return Boolean(process.env[key]?.trim());
}

function requireKeys(keys) {
  const missing = keys.filter((key) => !present(key));
  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(", ")}`);
  }
}

function optionalKeys(keys) {
  const missing = keys.filter((key) => !present(key));
  return missing;
}

async function readJsonResponse(response) {
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { text, json };
}

function parseJsonObject(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1]?.trim() || trimmed;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Response contained no JSON object");
  }
  return JSON.parse(source.slice(start, end + 1));
}

function supabaseUrl(path) {
  return `${process.env.SUPABASE_URL.replace(/\/$/, "")}${path}`;
}

async function checkEnvironment() {
  const required = [
    "GEMINI_API_KEY",
    "FIRECRAWL_API_KEY",
    "THECOMPANIESAPI_API_KEY",
  ];
  const optional = [
    "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
  ];
  const missingRequired = optionalKeys(required);
  if (missingRequired.length > 0) {
    throw new Error(`Missing ${missingRequired.join(", ")}`);
  }
  const missingOptional = optionalKeys(optional);
  if (missingOptional.length > 0) {
    return { status: "warn", message: `Required keys present. Optional keys missing: ${missingOptional.join(", ")}` };
  }
  return { message: "All expected keys are present. Secret values were not printed." };
}

async function checkSupabaseRest() {
  const missing = optionalKeys(["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  if (missing.length > 0) {
    return { status: "warn", message: `Skipped because ${missing.join(", ")} is not configured.` };
  }
  const response = await fetch(supabaseUrl("/rest/v1/leads?select=id,status&limit=1"), {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  const { text } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`REST check failed (${response.status}): ${text.slice(0, 220)}`);
  }
  return { message: "Connected and public.leads is queryable with service role." };
}

async function checkSupabaseRpc() {
  const missing = optionalKeys(["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  if (missing.length > 0) {
    return { status: "warn", message: `Skipped because ${missing.join(", ")} is not configured.` };
  }
  if (!liveWrite) {
    return { status: "warn", message: "Skipped write test. Re-run with --live-write to create/finalize a test lead." };
  }

  const email = `service-test+${Date.now()}@example.com`;
  const create = await fetch(supabaseUrl("/rest/v1/rpc/create_pending_lead"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ _website: "example.com", _email: email }),
  });
  const created = await readJsonResponse(create);
  if (!create.ok) {
    throw new Error(`create_pending_lead failed (${create.status}): ${created.text.slice(0, 220)}`);
  }

  const leadId = created.json;
  const finalize = await fetch(supabaseUrl("/rest/v1/rpc/finalize_lead"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      _lead_id: leadId,
      _status: "failed",
      _audit: null,
      _enrichment: { service_test: true },
      _error: "Service smoke test row.",
    }),
  });
  const finalized = await readJsonResponse(finalize);
  if (!finalize.ok) {
    throw new Error(`finalize_lead failed (${finalize.status}): ${finalized.text.slice(0, 220)}`);
  }

  return { message: `Created and finalized test lead ${leadId}.` };
}

async function checkFirecrawl() {
  requireKeys(["FIRECRAWL_API_KEY"]);
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url: "https://example.com",
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });
  const { text, json } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Firecrawl failed (${response.status}): ${text.slice(0, 220)}`);
  }
  const markdown = json?.data?.markdown || json?.markdown || "";
  if (!markdown) {
    return { status: "warn", message: "Connected, but scrape response had no markdown." };
  }
  return { message: "Scraped example.com markdown successfully." };
}

async function checkCompaniesApi() {
  requireKeys(["THECOMPANIESAPI_API_KEY"]);
  const response = await fetch("https://api.thecompaniesapi.com/v2/companies/microsoft.com", {
    headers: { Authorization: `Basic ${process.env.THECOMPANIESAPI_API_KEY}` },
  });
  const { text, json } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`The Companies API failed (${response.status}): ${text.slice(0, 220)}`);
  }
  const name = json?.name || json?.about?.name || json?.domain || "company payload";
  return { message: `Company enrichment returned ${name}.` };
}

async function checkGeminiAudit() {
  requireKeys(["GEMINI_API_KEY"]);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: 'Return ONLY valid JSON with this exact shape: { "ok": true }' }],
          },
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    },
  );
  const { text, json } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Gemini business audit model failed (${response.status}): ${text.slice(0, 220)}`);
  }
  const content = json?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  let parsed;
  try {
    parsed = parseJsonObject(content);
  } catch {
    return { status: "warn", message: "Connected, but response did not include expected JSON." };
  }
  if (parsed?.ok !== true) {
    return { status: "warn", message: "Connected, but JSON payload was unexpected." };
  }
  return { message: "Structured JSON response succeeded through Gemini." };
}

async function checkGeminiEmployeeCovered() {
  requireKeys(["GEMINI_API_KEY"]);
  return { message: "Covered by the structured Gemini business audit model check." };
}

async function checkResend() {
  const missing = optionalKeys(["RESEND_API_KEY"]);
  if (missing.length > 0) {
    return { status: "warn", message: `Skipped because ${missing.join(", ")} is not configured.` };
  }
  const response = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  const { text } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Resend account check failed (${response.status}): ${text.slice(0, 220)}`);
  }
  return { message: "Resend API key is valid." };
}

async function checkResendSend() {
  if (!emailRecipient) {
    return { status: "warn", message: "Skipped send test. Re-run with --send-email you@example.com." };
  }
  requireKeys(["RESEND_API_KEY"]);
  requireKeys(["RESEND_FROM_EMAIL"]);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [emailRecipient],
      subject: "UpSkill USA service test",
      html: "<p>This confirms Resend can send from the UpSkill USA app configuration.</p>",
    }),
  });
  const { text, json } = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Resend send failed (${response.status}): ${text.slice(0, 220)}`);
  }
  return { message: `Sent test email ${json?.id ? `(${json.id}) ` : ""}to ${emailRecipient}.` };
}
