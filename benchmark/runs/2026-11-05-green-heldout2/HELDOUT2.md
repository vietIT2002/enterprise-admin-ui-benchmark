# HELDOUT2 — three new briefs after the 0.5.2 rules

Skill at commit a096ffe. It adds three generic rules found as gaps in the first held-out suite:
- contact values are links (`mailto:`, `tel:`, website), with the primary contact marked;
- tables with a due or expiry date open with overdue rows first, then due-soon rows;
- forms with three or more sections offer "Save draft".

Generator and reviewers were Claude Sonnet 5.5, a fresh subagent per page, with the prompts in [GENERATION.md](../../GENERATION.md) and [REVIEW.md](../../REVIEW.md). The 12 reviews used 0.84M tokens (60–81k each); generation usage was not totalled.

## Setup

| | |
|---|---|
| Briefs | [12-contract-detail](../../briefs-heldout/12-contract-detail.md) (detail), [13-employee-onboarding](../../briefs-heldout/13-employee-onboarding.md) (form), [14-equipment-maintenance](../../briefs-heldout/14-equipment-maintenance.md) (list), 9 checklist items each |
| Runs | 2 per brief per side. Run 1 uses the English prompt, run 2 the Vietnamese one |
| Targeted items | 12#3 contact links, 12#4 milestones ordered overdue first, 13#4 save draft, 14#3 inspections ordered overdue first |
| Audit | `audit.js` 0.3.0 |

**Caveat.** The briefs were written after the three rules, by the same author, and four of the 27 items check those rules directly. The targeted items measure whether agents follow the rules on screens they have not seen. They do not measure generalization to requirements the skill never mentions. The other 23 items are closer to that.

## Results

| Metric | Without skill | With skill |
|---|---|---|
| Median audit score | 90 | **100** |
| Pages clean on hard metrics | 100% | 100% |
| Checklist pass rate | 21/54 (39%) | **48/54 (89%)** |
| Targeted items | 5/8 | **8/8** |
| Other 23 items | 16/46 (35%) | **40/46 (87%)** |
| Template tells seen by reviewers | 11 across 6 reviews | 1 (a loading-skeleton shimmer, not a surface) |

Per brief: contract detail 44% → 78%, onboarding form 28% → 89%, equipment list 44% → 100%.

The audit found muted text below 4.5:1 on 4/6 pages without the skill and 0/6 with it, and ALL-CAPS labels on 3/6 and 0/6. Stacked two-line rows appeared on 2/2 RED pages with a table and on 0/5 GREEN pages with a table.

### Targeted items

| Item | Without skill | With skill | Note |
|---|---|---|---|
| 12#3 contact links, primary marked | 1/2 | 2/2 | One RED page had the links but no primary marker |
| 12#4 milestones overdue first | 0/2 | 2/2 | RED listed milestones by date, paid ones first |
| 13#4 save draft | 2/2 | 2/2 | The baseline already offers a draft on a five-section onboarding form |
| 14#3 inspections overdue first | 2/2 | 2/2 | Sorting by next inspection date already puts overdue rows first, so this brief does not separate the rule |

The two rules that changed the result are contact links (12#3) and attention-first ordering on a page where date order is not urgency order (12#4). The save-draft and list-ordering rules held, but these briefs did not test them against a baseline that fails.

## Remaining failures with the skill (6)

| Item | Pages | Cause |
|---|---|---|
| 13#1 single column | 2/2 | Both forms used a grid: run 1 paired unrelated fields (Preferred name · Date of birth); run 2 put three fields per row. SKILL.md says "short related fields may share a row", and the agents stretched that exception. **Skill gap.** |
| 12#7 amendments show who approved them | 2/2 | Both pages listed number, date and summary, but showed the author or nothing. The skill has no rule about approvers on revision lists. Domain knowledge, or a candidate rule |
| 12#1 breadcrumb ends with the contract number | 1/2 | The page ended the breadcrumb with the contract title. SKILL.md says "the record's name", so the page followed the skill; the checklist and the skill disagree |
| 12#8 every section has an empty state with an action | 1/2 | The History tab's empty state has a message but no action. Minor |

## Audit false positive

Both GREEN onboarding pages scored 96 because `table-above-fold` warned about the documents table at about 2,250px. The rule is meant for list pages: it is an error on `list` and a warning for any other page type. A form or detail page with a table below the fold is normal, so the warning is a false positive. Without it both pages score 100. Audit 0.3.1 fixes this: the rule now applies only when the page type is `list` or unknown (see the fix round below).

## Fix round (0.5.2)

Two changes, committed in 1b00895:
- **Forms.** SKILL.md and `forms.md` now say one field per row, with the only exception two short fields that read as one value (City · Postal code, First name · Last name). The rule never allows three per row or a grid, and it is also in the Verify checklist.
- **Audit 0.3.1.** `table-above-fold` checks only `list` pages and pages without a type, so form, detail, dashboard, settings and wizard pages are skipped. A test covers it, and the HRM dashboard fixture test now expects no warning.

Brief 13 was re-run with the skill, 2 pages, in [2026-11-05-refactor-heldout2](../2026-11-05-refactor-heldout2/):

| | GREEN | After the fix |
|---|---|---|
| 13#1 single column | 0/2 | **2/2**. Only First name · Last name and City · Postal code share a row |
| Audit score | 96, 96 | **100, 100** |
| Checklist | 16/18 | 16/18 |

The checklist total did not move, because each new page failed one item that the earlier GREEN pages had passed:
- **13#3 (run 2).** Phone fields used `inputmode="tel"` without `type="tel"`.
- **13#5 (run 1).** The page wrapped `<main class="overflow-y-auto">` in a `min-h-screen` shell, so `<main>` grew instead of scrolling. The document scrolled and the `sticky bottom-0` action bar never stuck. The skill's own app-shell code has no `overflow` on `<main>`; the agent added it.

Both are general pitfalls, so 0.5.2 adds a line for each:
- the input type that matches the value, in SKILL.md and `forms.md`;
- where `sticky` sticks, in SKILL.md and `forms.md`.

Those two lines were not re-measured.

## Audit 0.4.0: `sticky-inert`

The sticky failure is now an audit rule. To check it, the rule was run on copies of all 127 benchmark pages, so the stored results were left unchanged. It flagged 2 pages, and both were real problems:

| Page | Severity | What it found |
|---|---|---|
| refactor-heldout2 13 run 1 | error ×2 | The `sticky bottom-0` action bar and the `sticky top-4` section list both sit inside `main#scroller`, which never scrolls |
| green 01-orders-list run 2 | warn ×1 | A `sticky` table header inside an `overflow-x-auto` container that grows with its rows |

The other 47 pages that use `sticky` passed. The orders-list case followed `tables.md`, which suggested a sticky header inside `overflow-x-auto`. That advice is now corrected: a frozen header needs a container with a height that scrolls both ways.

## Fix round 2

Changes in 2a1d335:
- Breadcrumbs end with the record's number when records are known by number (contracts, orders, invoices).
- Changes that need sign-off (amendments, revisions) list who approved them, with the date, or "Pending approval" and who it is waiting for.

Briefs 13 and 12 were re-run with the skill, 2 pages each, in [2026-11-05-refactor2-heldout2](../2026-11-05-refactor2-heldout2/). Audit 0.4.0 scored all 4 pages 100.

| Item | HELDOUT2 GREEN | Fix round 1 | Fix round 2 |
|---|---|---|---|
| 13#1 single column, labels above | 0/2 | 2/2 | 1/2 |
| 13#3 input types | 2/2 | 1/2 | **2/2** |
| 13#5 sticky Save and Cancel | 2/2 | 1/2 | **2/2** |
| 12#1 breadcrumb ends with the contract number | 1/2 | — | **2/2** |
| 12#7 amendments show who approved them | 0/2 | — | **2/2** |
| Checklist, onboarding form | 16/18 | 16/18 | **17/18** |
| Checklist, contract detail | 14/18 | — | **17/18** |

The two lines added after fix round 1 held: both pages used `type="tel"`, and both sticky bars stuck, with no `sticky-inert` findings. Two items still failed:
- **13#1, run 1.** The page's fields are in one column, but `<label>` had no `block`, so the label sat beside each short field. SKILL.md and `forms.md` now say labels are `block`; this was not re-measured.
- **12#8, run 1.** The Renewal panel had no empty state. The rule already exists; the agent missed it.

## Limitations

- Two runs per brief, one reviewer per page, and the reviewers see `red` or `green` in the paths.
- The briefs and the rules share an author (see the caveat above).
- 13#4 and 14#3 passed without the skill, so the save-draft rule and attention-first list ordering are not yet shown to change behaviour.
