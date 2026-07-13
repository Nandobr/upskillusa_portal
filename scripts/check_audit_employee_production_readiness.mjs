#!/usr/bin/env node

import assert from "node:assert/strict";
import { requestFirecrawlEmployeeSearch, resolveIndexedEmployeeEvidence } from "../src/lib/audit-employee-search.ts";

const args = process.argv.slice(2);
const live = args.includes("--live");

if (live) {
  await runLiveCheck(args);
} else {
  await runDeterministicCheck();
}

async function runDeterministicCheck() {
  const observations = [];

  let disabledRequests = 0;
  const disabledStartedAt = performance.now();
  const disabled = await requestFirecrawlEmployeeSearch({
    enabled: false,
    apiKey: "mock-key",
    companyName: "Deterministic Fixture Company",
    domain: "fixture.example",
    fetchImpl: async () => {
      disabledRequests += 1;
      throw new Error("The kill switch must prevent this request");
    },
  });
  observations.push({
    mode: "deterministic-disabled",
    requestCount: disabledRequests,
    latencyMs: elapsedMs(disabledStartedAt),
    outcome: disabled.status,
    reason: disabled.status === "success" ? null : disabled.reason,
  });
  assert.deepEqual(disabled, { status: "unavailable", reason: "fallback-disabled" });
  assert.equal(disabledRequests, 0, "the kill switch must issue no fallback request");

  let enabledRequests = 0;
  const enabledStartedAt = performance.now();
  const enabled = await requestFirecrawlEmployeeSearch({
    enabled: true,
    apiKey: "mock-key",
    companyName: "Deterministic Fixture Company",
    domain: "fixture.example",
    fetchImpl: async () => {
      enabledRequests += 1;
      return new Response(JSON.stringify({
        data: [{
          url: "https://www.linkedin.com/company/deterministic-fixture-company",
          title: "Deterministic Fixture Company | LinkedIn",
          description: "Deterministic Fixture Company website fixture.example. Company size: 51-200 employees.",
        }],
      }));
    },
  });
  assert.equal(enabled.status, "success");
  const resolution = enabled.status === "success"
    ? resolveIndexedEmployeeEvidence({
        results: enabled.results,
        companyName: "Deterministic Fixture Company",
        domain: "fixture.example",
        observedAt: enabled.observedAt,
      })
    : null;
  observations.push({
    mode: "deterministic-enabled",
    requestCount: enabledRequests,
    latencyMs: elapsedMs(enabledStartedAt),
    outcome: resolution?.status ?? enabled.status,
    reason: resolution?.status === "unavailable" ? resolution.reason : null,
  });
  assert.equal(enabledRequests, 1, "an eligible audit must issue at most one fallback request");
  assert.equal(resolution?.status, "accepted", "enabled fallback should accept verified fixture evidence");

  printSanitizedObservations(observations);
}

async function runLiveCheck(argv) {
  const companyName = optionValue(argv, "--company");
  const domain = optionValue(argv, "--domain");
  if (!companyName || !domain) {
    throw new Error("Live mode requires --company <name> and --domain <domain>.");
  }

  loadLocalEnvironmentIfAvailable();
  if (process.env.FIRECRAWL_EMPLOYEE_SEARCH_ENABLED !== "true") {
    throw new Error("Live check stopped: FIRECRAWL_EMPLOYEE_SEARCH_ENABLED must be true.");
  }
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error("Live check stopped: FIRECRAWL_API_KEY is not configured.");
  }

  let requestCount = 0;
  const startedAt = performance.now();
  const outcome = await requestFirecrawlEmployeeSearch({
    enabled: true,
    apiKey: process.env.FIRECRAWL_API_KEY,
    companyName,
    domain,
    fetchImpl: async (input, init) => {
      requestCount += 1;
      assert.ok(requestCount <= 1, "live readiness check exceeded its one-request cap");
      return fetch(input, init);
    },
  });

  const resolution = outcome.status === "success"
    ? resolveIndexedEmployeeEvidence({
        results: outcome.results,
        companyName,
        domain,
        observedAt: outcome.observedAt,
      })
    : null;
  assert.equal(requestCount, 1, "enabled live readiness check must issue exactly one bounded request");
  printSanitizedObservations([{
    mode: "live-enabled",
    requestCount,
    latencyMs: elapsedMs(startedAt),
    outcome: resolution?.status ?? outcome.status,
    reason: resolution?.status === "unavailable"
      ? resolution.reason
      : outcome.status === "success"
        ? null
        : outcome.reason,
  }]);
}

function loadLocalEnvironmentIfAvailable() {
  if (typeof process.loadEnvFile !== "function") return;
  try {
    process.loadEnvFile(".env.local");
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
  }
}

function optionValue(argv, name) {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1]?.trim() : undefined;
}

function elapsedMs(startedAt) {
  return Math.max(0, Math.round((performance.now() - startedAt) * 10) / 10);
}

function printSanitizedObservations(observations) {
  console.log("Audit employee fallback production-readiness observations (sanitized):");
  console.log(JSON.stringify(observations, null, 2));
}
