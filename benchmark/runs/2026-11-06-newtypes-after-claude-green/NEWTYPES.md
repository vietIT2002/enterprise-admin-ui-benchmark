# New screen types — reports, printable documents, calendars, boards, trees

Before this round the skill had no recipe for five kinds of screens that business apps need. We wrote one brief per kind and measured them in two rounds:
- **Round 1:** without the skill and with 0.5.7.
- **Round 2:** with four new references written from the round 1 failures: `reports-print.md`, `calendars.md`, `boards.md` and `trees.md`.

Setup:
- Claude Sonnet 5.5 at default effort, single-file HTML with the Tailwind CDN, prompts in English.
- One page per side per brief, 9 checklist items per brief.
- One open reviewer per page.
- Every page was re-audited with `audit.js` 0.5.1 (see below).

## Results

| Brief | Without the skill | 0.5.7 | 0.5.7 + new references |
|---|---|---|---|
| 15 Revenue report | 4/9 | not written\* | 8/9 |
| 16 Printable invoice | 4/9 | 8/9 | **9/9** |
| 17 Leave calendar | 2/9 | 1/9 | 7/9 |
| 18 Service desk board | 3/9 | 4/9 | **9/9** |
| 19 Chart of accounts (tree) | 2/9 | 5/9 | 8/9 |
| **Checklist pass rate** | **33%** (15/45) | **50%** (18/36) | **91%** (41/45) |
| Median audit score | 72 | 90 | 90 |

\* The agent finished without writing the page: in `-p` mode the Write tool stopped at a permission prompt that nobody answered. `bench.mjs` now pre-approves the file tools (`--allowedTools Read,Write,Edit,Glob,Grep`).

**This is not a held-out result.** The new references were written from the round 1 failures on these same five briefs, so round 2 measures whether the references fix what they were written to fix. For unseen screens of these kinds, a new set of briefs is needed.

Per-page audit scores in round 2: report 100, invoice 76, calendar 70, board 90, tree 100.

## What still failed, and what changed

| Page | Finding | Change (not re-measured) |
|---|---|---|
| Calendar | Leave bars and "+N more" were in the DOM but invisible. The day cells had `position: relative` and a solid background, so they painted over the bars that shared their grid (2 checklist items). | `calendars.md`: bars that share a grid with the day cells get `relative z-10`, and the screenshot is checked for every bar. |
| Calendar | Entries 20px tall with 11px text; day numbers of the previous and next month in slate-400 (2.56:1). | `calendars.md`: entries and "+N more" at least 24px tall with 12px text, and other months' day numbers in slate-500. |
| Chart of accounts | The status badge "Ngừng h.đ." was abbreviated and still wrapped onto two lines in a fixed-width column. | `tables.md`: badges are `whitespace-nowrap` with the whole word, and the column takes the width of its longest status. |
| Revenue report | The cells held numbers without a currency symbol, with the currency in the header ("Revenue (USD)"). | None. The skill prescribes this for single-currency columns (`data-formatting.md`); the checklist item asked for a symbol in each cell. |
| Invoice | The line-number column (1, 2, 3 …) was left-aligned without tabular figures (audit `numeric-align`, `tabular-nums`). | None; minor. |

A bug in the skill's own code: in `calendars.md`, `workingDays` built each date with `toISOString()`. In time zones east of UTC (Vietnam is UTC+7) that is the previous day, so a public holiday on a Friday was not excluded: Mon–Fri with a Friday holiday counted 5 working days instead of 4. It now uses local date parts.

## Audit 0.5.1: month grids are not data tables

The audit treated the calendar's month grid (`role="grid"`, 7 cells a row) as a data table. It reported each day number as a left-aligned number without tabular figures (41 cells), and each 114px week row as too tall. Version 0.5.1 recognises a month grid:
- every row has 7 cells (8 with a week-number column);
- the cells start with consecutive days of the month, or restart at 1.

The row-height, stacked-row and numeric rules skip such a grid; its text is still checked as body text. A weekday timesheet (hours under Mon … Sun) is not consecutive days, so it is still checked as a table.

| Page | Score with 0.5.0 | Score with 0.5.1 |
|---|---|---|
| Calendar, without the skill | 52 | 52 |
| Calendar, 0.5.7 | 70 | 80 |
| Calendar, 0.5.7 + new references | 36 | **70** |

The page without the skill had no month grid the audit could read as a table, so its score did not change. The remaining findings on the round 2 calendar (target size, 11px text, contrast) are real. The other pages' scores did not change.

## Cost

| Round | Generation | Reviews | Total |
|---|---|---|---|
| 1: without the skill, 5 pages | $3.28 ($0.66 a page) | $2.17 | $5.44 |
| 1: 0.5.7, 5 attempts, 4 pages | $9.78 ($1.96 an attempt) | $2.19 | $11.96 |
| 2: 0.5.7 + new references, 5 pages | $10.29 ($2.06 a page) | $2.62 | $12.91 |
| **All** | | | **$30.31** |

These pages cost more than the earlier suites ($1.43 a page with the skill in [COST](../2026-11-05-cost-claude-green/COST.md)). The screens are larger: a multi-level account tree with balances beside a detail panel, and a month and a week of leave with lanes and daily counts. The chart of accounts took 28 turns and $3.58 in round 2.

## Files

- Round 1: [`2026-11-06-newtypes-claude-red`](../2026-11-06-newtypes-claude-red/) and [`2026-11-06-newtypes-claude-green`](../2026-11-06-newtypes-claude-green/) ([COMPARE](../2026-11-06-newtypes-claude-green/COMPARE.md)).
- Round 2: this folder ([COMPARE](COMPARE.md) against round 1 without the skill).
- Briefs: `benchmark/briefs-heldout/15-revenue-report.md` to `19-chart-of-accounts.md`.
