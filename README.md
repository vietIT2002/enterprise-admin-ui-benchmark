# enterprise-admin-ui benchmark

This repository holds the data behind the benchmark of [enterprise-admin-ui](https://github.com/vietIT2002/enterprise-admin-ui), an Agent Skill that teaches AI coding agents to build management screens (admin, ERP, CRM, HRM).

Each screen was built twice by the same model from the same brief: once as the agent normally would, and once after reading the skill's `SKILL.md`. Every page was then scored with an automated audit and an acceptance checklist.

**Browse the pages side by side:** <https://vietit2002.github.io/enterprise-admin-ui-benchmark/>. The gallery shows each screen without and with the skill, its audit score, its checklist result and links to the live page.

Start with [benchmark/REPORT.md](benchmark/REPORT.md) for the results and their limitations.

## Contents

| Path | What it is |
|---|---|
| `benchmark/REPORT.md` | Results, setup and limitations |
| `benchmark/GENERATION.md`, `benchmark/REVIEW.md` | The exact generation and review prompts |
| `benchmark/briefs/`, `benchmark/briefs-heldout/` | The briefs: an English and a Vietnamese prompt plus an acceptance checklist each |
| `benchmark/runs/<date>-<condition>/<brief>/` | One folder per brief and condition. `run-N.html` is the generated page. `.png` is the first 1440×900 screen, `.full.png` the whole page. `.audit.json` holds the audit result and `.review.json` the checklist review. `.rendered.html` is the settled DOM without scripts |
| `benchmark/runs/*/summary.md`, `COMPARE.md` | Aggregates per folder and RED-vs-GREEN comparisons |
| `benchmark/tools/` | Audit runner, aggregation, comparison, trigger-rate and Codex runners |
| `skills/enterprise-admin-ui/scripts/audit.js` | The browser audit the scores come from |

Conditions: `red` means without the skill, `green` with it, and `refactor` means a re-run after a fix to the skill. `heldout` folders use briefs written after the skill.

## Reproduce

```bash
npm install
npx playwright install chromium
node benchmark/tools/audit-page.mjs --run benchmark/runs/2026-11-04-green
node benchmark/tools/aggregate.mjs benchmark/runs/2026-11-04-green
node benchmark/tools/compare.mjs benchmark/runs/2026-11-04-red benchmark/runs/2026-11-04-green
```

To generate new pages with the skill (`codex-run.mjs`, GREEN prompts), clone the [skill repository](https://github.com/vietIT2002/enterprise-admin-ui) and copy its `skills/enterprise-admin-ui` folder into this one.

Re-auditing writes new `.audit.json` files next to the pages. Scores can differ from the stored ones when the audit version differs: each `.audit.json` records the version it was made with.

## Notes

- **Paths.** `<repo>` stands for the folder of the skill's development repository, and `<scratch>` for a temporary working folder. Both were replaced in prompts and logs.
- **Left out.** The raw session logs of the trigger-rate runs are not included. `runs/2026-11-05-trigger/results.json` holds the per-prompt outcomes.
- **Samples.** They are small, and most reviews were open: the reviewer knew the condition. A blind re-review of the 12 held-out 2 pages agreed on 97% of items ([BLIND.md](benchmark/runs/2026-11-05-blind-heldout2/BLIND.md)). See the Limitations section of the report.

## License

MIT, the same as the skill.
