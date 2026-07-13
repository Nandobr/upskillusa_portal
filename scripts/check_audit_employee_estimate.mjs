#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  createRangeEmployeeEstimate,
  lowerBoundForEmployeeRange,
  parseEmployeeRange,
  selectAuditEmployeeEstimate,
} from "../src/lib/audit-employee-estimate.ts";

const selected = (estimate) => ({
  status: estimate.status,
  value: estimate.value,
  employees: estimate.employees,
  range: estimate.range,
  declaredRange: estimate.declaredRange,
  basis: estimate.basis,
  provider: estimate.provider,
  confidence: estimate.confidence,
  unavailableReason: estimate.unavailableReason,
});

const selectionCases = [
  {
    name: "positive exact count wins over a structured range",
    input: { exact: 42.4, bucket: "11-50", inactiveDomain: true },
    expected: {
      status: "known",
      value: 42,
      employees: 42,
      range: { min: 42, max: 42 },
      declaredRange: null,
      basis: "reported-exact",
      provider: "the-companies-api",
      confidence: "high",
      unavailableReason: null,
    },
  },
  {
    name: "invalid exact count yields to a structured range",
    input: { exact: 0, bucket: "51-200" },
    expected: {
      status: "known",
      value: 51,
      employees: 51,
      range: { min: 51, max: 200 },
      declaredRange: "51-200 employees",
      basis: "range-lower-bound",
      provider: "the-companies-api",
      confidence: "high",
      unavailableReason: null,
    },
  },
  {
    name: "generated numeric range is not calculation-grade evidence",
    input: { exact: null, bucket: null },
    expected: {
      status: "unknown",
      value: null,
      employees: null,
      range: null,
      declaredRange: null,
      basis: "unavailable",
      provider: "none",
      confidence: "none",
      unavailableReason: "missing-primary-data",
    },
  },
  {
    name: "vague mid-market label does not create a hidden 250 estimate",
    input: {},
    expected: {
      status: "unknown",
      value: null,
      employees: null,
      range: null,
      declaredRange: null,
      basis: "unavailable",
      provider: "none",
      confidence: "none",
      unavailableReason: "missing-primary-data",
    },
  },
  {
    name: "unsupported active company remains unknown",
    input: { exact: null, bucket: "unknown" },
    expected: {
      status: "unknown",
      value: null,
      employees: null,
      range: null,
      declaredRange: null,
      basis: "unavailable",
      provider: "none",
      confidence: "none",
      unavailableReason: "missing-primary-data",
    },
  },
  {
    name: "inactive domain remains distinct from unknown and zero headcount",
    input: { exact: null, bucket: null, inactiveDomain: true },
    expected: {
      status: "inactive",
      value: null,
      employees: null,
      range: null,
      declaredRange: null,
      basis: "inactive-domain",
      provider: "none",
      confidence: "high",
      unavailableReason: null,
    },
  },
  {
    name: "generated inactive wording is not trusted structured evidence",
    input: { exact: null, bucket: null, sizeEstimate: "N/A (Parked Domain)" },
    expected: {
      status: "unknown",
      value: null,
      employees: null,
      range: null,
      declaredRange: null,
      basis: "unavailable",
      provider: "none",
      confidence: "none",
      unavailableReason: "missing-primary-data",
    },
  },
];

for (const testCase of selectionCases) {
  assert.deepEqual(selected(selectAuditEmployeeEstimate(testCase.input)), testCase.expected, testCase.name);
}

const acceptedRanges = [
  ["Company size: 1-10 employees", { min: 1, max: 10 }],
  ["51\u2013200 employees", { min: 51, max: 200 }],
  ["Company size: 501\u20141,000 people", { min: 501, max: 1000 }],
  ["Company size: 1k - 5k staff", { min: 1000, max: 5000 }],
  ["Company size: 1.5 k\u20132.5k employees", { min: 1500, max: 2500 }],
  ["Company size: 10,001+ employees", { min: 10001, max: null }],
  ["Workforce of 100k +", { min: 100000, max: null }],
];

for (const [input, expected] of acceptedRanges) {
  assert.deepEqual(parseEmployeeRange(input), expected, input);
  assert.equal(lowerBoundForEmployeeRange(input), expected.min, `${input} lower bound`);
}

const rejectedRanges = [
  "Company size: 0-10 employees",
  "Company size: 200-51 employees",
  "Company size: 51-51 employees",
  "Company size: 1-10-20 employees",
  "Company size: 1.25-2 employees",
  "Company size: 10,000,001+ employees",
  "Company size: 51 employees",
  "51-200 followers",
  "143 employees on LinkedIn",
  "Revenue: $51-200 million",
  "Company size: 11-50 employees; another source says 51-200 employees",
  "Revenue: $51-200 million in the most recently reported fiscal period, excluding adjustments. Employees work across the country.",
];

for (const input of rejectedRanges) {
  assert.equal(parseEmployeeRange(input), null, input);
}

assert.deepEqual(
  parseEmployeeRange(" 501 - 1,000 ", { requireEmployeeContext: false }),
  { min: 501, max: 1000 },
  "structured provider fields do not need repeated employee context",
);

const firecrawlEstimate = createRangeEmployeeEstimate(
  "Company size: 51-200 employees",
  {
    provider: "firecrawl",
    domainMatch: "matched",
    evidenceUrl: "https://www.linkedin.com/company/example",
    evidenceExcerpt: "Company size: 51-200 employees",
    observedAt: "2026-07-11T12:00:00.000Z",
  },
);
assert.ok(firecrawlEstimate);
assert.equal(firecrawlEstimate.value, 51);
assert.equal(firecrawlEstimate.confidence, "medium");
assert.equal(firecrawlEstimate.domainMatch, "matched");

const checkCount = selectionCases.length + acceptedRanges.length * 2 + rejectedRanges.length + 5;
console.log(`Audit employee estimate checks passed (${checkCount} assertions).`);
