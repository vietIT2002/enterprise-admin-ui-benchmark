# HELDOUT3 — six screens the skill never saw, reviewed blind

The earlier held-out suites had briefs written by the skill's author. That author knew the skill's rules, so the checklists may have leaned towards them. This suite removes that bias in three ways:
- **Briefs:** a separate agent wrote six briefs without reading the skill. It could read only one earlier brief, for the file format. The briefs were committed (f9f6c16) before any page was built.
- **Version:** the pages were built with v0.5.8.
- **Review:** the review was blind.

## Setup

| | |
|---|---|
| Briefs | `20-ar-aging-report`, `21-payslip-print`, `22-room-booking-calendar`, `23-recruitment-pipeline`, `24-org-structure`, `25-audit-log` in `benchmark/briefs-heldout/`, 9 checklist items each. They cover a report, a printable document, a calendar, a board, a tree and an audit log |
| Generation | Claude Sonnet 5.5 at default effort, English prompt, single HTML file with the Tailwind CDN, one page per side. Isolated `claude -p` runs (`npm run bench`) |
| Review | Blind (`--blind --seed 20261106`). Each reviewer saw one randomly coded folder (`page.html`, `first.png`, `full.png`, `audit.json`) in a temp directory whose name says nothing about the condition. No generated page mentions the skill. The key is in [`2026-11-06-heldout3-claude-blind/key.json`](../2026-11-06-heldout3-claude-blind/key.json) |
| Audit | `audit.js` 0.5.1 |

## Results

| Brief | Without the skill | With the skill | Audit score |
|---|---|---|---|
| 20 Accounts receivable aging | 1/9 | 4/9 | 58 → 90 |
| 21 Payslip, view and print | 3/9 | 4/9 | 72 → 100 |
| 22 Meeting room booking calendar | 3/9 | 6/9 | 66 → 80 |
| 23 Recruitment pipeline board | 2/9 | 6/9 | 70 → 90 |
| 24 Organisation structure tree | 0/9 | 2/9 | 72 → 100 |
| 25 Audit log | 3/9 | 4/9 | 78 → 72 |
| **Checklist** | **12/54 (22%)** | **26/54 (48%)** | median **71 → 90** |

Template tells seen by the reviewers: 18 on 5 pages without the skill, 3 on 2 pages with it.

With the skill, the pages passed more than twice as many items, but less than half of all items. The earlier held-out suites reached 72–89% with the skill. This suite is the more honest estimate for screens nobody tuned the skill or the checklist for.

## Where the skill helps, and where it cannot

Each checklist item is either about how the screen behaves or about what the business needs it to contain. This split is the author's own reading of the items:
- **UI behaviour:** states, filters and counts, formatting, keyboard and screen-reader access, confirmations, print and export.
- **Domain content:** the aging basis, payroll lines and statutory deductions, vacancies, before/after values in a log, masking secrets.

| Brief | Items, in order (U = UI behaviour, D = domain content) |
|---|---|
| 20 | D D U U U U U U U |
| 21 | D D D D U U U D U |
| 22 | D U U U D D U U U |
| 23 | D U D D U D U D U |
| 24 | U U D U D D U U U |
| 25 | D D D D U D U U U |

| Kind | Without the skill | With the skill |
|---|---|---|
| UI behaviour (31 items) | 5/31 (16%) | **18/31 (58%)** |
| Domain content (23 items) | 7/23 (30%) | 8/23 (35%) |

The skill is about UI behaviour, and that is where the gain is: 16% to 58%. It carries no domain knowledge, and none of these domain requirements were in the prompts. The English payslip prompt names no country, so the page with the skill built a US payslip, while the checklist asked for Vietnamese social, health and unemployment insurance. Domain items moved only from 30% to 35%. Stating these requirements in the prompt, or in the project's `DESIGN.md` or docs, is the user's part.

### UI behaviour the skill pages still missed

13 of 31 UI items failed with the skill:
- **Report header and print.**
  - 20#3: the summary line states the total owed but not the total overdue.
  - 20#8: the print stylesheet hides the whole header, including the as-of date it should keep.
- **Formatting.** 20#4: credit balances are not marked with a minus sign or brackets.
- **Expandable rows.**
  - 20#6: a customer opens in a side panel instead of expanding in place with `aria-expanded`.
  - 24#2: a unit shows one headcount and not total plus direct.
- **Label cells.** 21#6: the payslip tables have column headers only, and line labels are plain `<td>`, not `<th scope="row">`.
- **States on static pages.**
  - 21#9: the payslip has no month switcher and no empty, loading or error state.
  - 24#9: the unit panel has no empty-employees message and no loading or error state.
- **Counts.**
  - 22#4: room filters do not show how many rooms match.
  - 25#7: the export button does not say how many entries it will export.
- **Accessible names.** 22#8: the names of calendar slots leave out the date.
- **Details and confirmations.**
  - 24#4: the details panel has no unit code or cost centre.
  - 24#8: deactivating a unit is blocked outright instead of confirmed with its impact.

Most of these are rules the skill already states, and the agent did not apply them. The run did not record which references the agent opened.

Already in the skill:
- states for every data region (`SKILL.md`, States);
- a visible result count after filtering (`filters-search.md`);
- an export button that names the count, "Export 1.245 orders" (`bulk-import-export.md`);
- a print stylesheet that keeps the title and period (`reports-print.md`);
- negative values with the minus sign (`data-formatting.md`);
- entry names that include the dates (`calendars.md`, for bookings but not for free slots).

Not written down yet:
- `<th scope="row">` for the labels of label–value tables such as payslip lines;
- dates in the names of free calendar slots;
- `aria-expanded` rows that open in place.

So the next gain is more likely to come from getting agents to apply the rules they skip than from adding new rules.

### Items a reviewer might grade differently

- 22#1 asks for rooms as rows and time across. The page with the skill put rooms in columns and time down the side, a layout that is also common.
- 21#2 and 21#3 expect Vietnamese payroll lines from an English prompt that names no country.
- 23#8 asks for a CV link, which mock data can only fake.

## Cost

| Phase | Pages | Cost |
|---|---|---|
| Generation without the skill | 6 | $3.43 ($0.57 a page) |
| Generation with the skill | 6 | $10.74 ($1.79 a page) |
| Blind reviews | 12 | $5.86 |
| **Total** | | **$20.03** |

## Limitations

- **Sample.** One page per side per brief, English prompts only.
- **Review.** One blind reviewer per page, from the same model family as the generator.
- **Classification.** The split into UI behaviour and domain content is one person's reading of the items.
- **Strict briefs.** The briefs are demanding on purpose. Several items bundle two or three requirements, and the whole item fails if one part is missing.

## Files

- Pages, audits and blind reviews: [`2026-11-06-heldout3-claude-red`](../2026-11-06-heldout3-claude-red/) and this folder ([COMPARE](COMPARE.md)). Each `run-1.review.json` is the blind review, marked `"blind": true`.
- Run cost per call: [`bench-usage.json`](bench-usage.json).
