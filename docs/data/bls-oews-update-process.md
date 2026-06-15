# BLS OEWS Data Update Process

This app keeps BLS wage and employment refreshes separate from the active IKIGAI occupation dataset until the update has been reviewed.

## Current State

- Active assessment data: `src/lib/data/occupations.ts`
- May 2025 OEWS source data: `src/lib/data/bls-oews-2025-national.ts`
- Candidate slug-to-SOC map: `src/lib/data/occupation-oews-2025-map.ts`
- Match review report: `docs/data/bls-oews-2025-match-review.json`

The active dataset still owns fields that OEWS does not provide:

- `education`
- `outlook`
- `outlook_desc`
- `url`
- `exposure`
- `exposure_rationale`
- `vulnerability`
- `vulnerability_label`

The OEWS file should only be used to refresh wage/employment facts unless a separate source is added.

## Source File

Use the official BLS OEWS national XLSX file for the source year.

For May 2025, the downloaded workbook was:

```txt
national_M2025_dl.xlsx
```

Official source page:

```txt
https://www.bls.gov/oes/tables.htm
```

## Generate A Versioned OEWS Source

Run the updater with the official workbook path and source year:

```bash
npm run data:update:bls-oews -- /path/to/national_M2025_dl.xlsx --year 2025
```

The script reads the XLSX directly using Python standard-library XML/ZIP tools. No spreadsheet dependency is required.

Generated outputs:

```txt
src/lib/data/bls-oews-2025-national.ts
src/lib/data/occupation-oews-2025-map.ts
docs/data/bls-oews-2025-match-review.json
```

## Review Rules

Before using OEWS values in the app, review `docs/data/bls-oews-2025-match-review.json`.

Statuses:

- `exact-detailed`: safest automatic candidate; current title matched a detailed OEWS occupation.
- `exact-any-group`: review manually; match may be a broad, minor, or major group.
- `unmatched`: requires manual SOC mapping before use.

Do not promote OEWS data by title match alone. Prefer a reviewed `slug -> OCC_CODE` mapping.

## Field Mapping

| App field | OEWS field | Use |
| --- | --- | --- |
| `pay` | `A_MEDIAN` | Use as annual median pay when available |
| `jobs` | `TOT_EMP` | Use as national employment estimate |
| `category` | `OCC_CODE` major group | Derive only if needed |
| `title` | `OCC_TITLE` | Use for review, not as the permanent key |

OEWS fields not currently used by the assessment but available for future enhancements:

- `A_MEAN`
- `H_MEAN`
- `H_MEDIAN`
- `A_PCT10`
- `A_PCT25`
- `A_PCT75`
- `A_PCT90`
- `EMP_PRSE`
- `MEAN_PRSE`
- `ANNUAL`
- `HOURLY`

## Promotion Plan

When the mapping has been reviewed:

1. Add or update a merge helper that joins `occupations.ts` with the versioned OEWS source by `OCC_CODE`.
2. Replace only `pay` and `jobs` from OEWS.
3. Keep AI-risk fields and OOH-derived fields from the active dataset.
4. Add explicit source metadata if the active schema is expanded:
   - `paySourceYear`
   - `jobsSourceYear`
   - `oewsOccCode`
   - `outlookSourcePeriod`
5. Run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Cautions

- OEWS employment excludes self-employed workers.
- Some rows do not publish annual median wages.
- OOH URLs are stable profile URLs and are not replaced by OEWS.
- OOH outlook and education fields require BLS OOH/Employment Projections data, not OEWS.
