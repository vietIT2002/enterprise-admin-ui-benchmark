# GREEN — management screens with the skill installed

Same briefs, generator, audit and review protocol as RED (`../2026-11-04-red/RED.md`), with the skill at `skills/enterprise-admin-ui` (SKILL.md 173 lines + 8 references). Held-out briefs that the skill was never written against are reported separately in §6.

## 1. Setup

| | |
|---|---|
| Date | 2026-11-04 |
| Generator | Claude Sonnet 5.5, fresh subagent per page, GREEN prompt from `benchmark/GENERATION.md` (read SKILL.md first, open references as needed, no other repo files) |
| Main suite | 8 briefs × 5 runs = 40 pages (runs 1, 3, 5 EN; runs 2, 4 VI), 5 rounds dispatched one after another |
| Held-out suite | 3 briefs × 2 runs = 6 pages (`benchmark/briefs-heldout/`, run 1 EN, run 2 VI), folder `../2026-11-04-green-heldout/` |
| Audit | `audit.js` 0.2.0, `benchmark/tools/audit-page.mjs --run`, 1440×900, settled DOM; 46/46 audited, 0 failures |
| Checklist review | 16 main reviews (run-1 + run-2 of each brief) + 6 held-out reviews, Claude Sonnet 5.5, `benchmark/REVIEW.md`, identical prompts to RED apart from paths |
| Incidents | None: no generator hung, no stray files (git status checked after every round) |
| Tokens (per-agent usage) | main ≈ 4.9M (40 generations ≈ 3.7M + 16 reviews ≈ 1.2M); held-out ≈ 1.1M (6 + 6); total ≈ 6.0M |

## 2. Targets (spec §12)

| Target | Main suite | Held-out |
|---|---|---|
| Median violated rules reduced ≥70% | 3 → 0 (100%) ✓ | 3 → 0.5 (83%) ✓ |
| ≥80% of runs clean on hard metrics | 90% ✓ | 100% ✓ |
| Checklist pass rate ≥90% | 100% ✓ | **72% ✗** |

The main-suite checklist result needs the caveat in §9: the SKILL.md recipes were written from the RED failures on these same checklists. The held-out 72% is the better estimate of how the skill does on screens it has not seen.

## 3. Audit results (main suite)

Full tables: `COMPARE.md`, `summary.md`, `summary.json`.

| Metric / rule | RED | GREEN | Δ |
|---|---|---|---|
| Median score | 82 | **100** | +18 |
| Median violated rules | 3 | **0** | −3 |
| Runs clean on hard metrics | 68% | **90%** | +22 |
| text-contrast | 68% (27/40) | **0% (0/40)** | −68 |
| uppercase-text | 73% (29/40) | **0%** | −73 |
| surface-shadow | 35% (14/40) | **0%** | −35 |
| table-row-two-line | 33% (11/33) | 3% (1/31) | −30 |
| table-row-height | 24% (8/33) | **0% (0/31)** | −24 |
| numeric-align | 23% (5/22) | 7% (2/30) | −16 |
| tabular-nums | 18% (4/22) | **0% (0/30)** | −18 |
| radius-scale | 15% (6/40) | **0%** | −15 |
| font-size-base | 3% (1/40) | **10% (4/40)** | **+7 (regression, §7)** |
| type-scale, target-size, no-backdrop-blur | 3% each | 0% | −3 |
| icon-button-name, no-gradient, emoji-icon, table-above-fold, single-primary-action | 0% | 0% | 0 |

Median table row height is now 40–41px in every brief with a table (RED 39–61px). Median radius count 2 (RED 2–3). Dominant text size 14px in every brief except 08 (12px, §7).

## 4. Checklist results (main suite)

| Brief | RED | GREEN |
|---|---|---|
| 01 orders list | 60% | 100% |
| 02 customer detail | 50% | 100% |
| 03 invoice form | 63% | 100% |
| 04 role permissions | 36% | 100% |
| 05 CSV import | 67% | 100% |
| 06 expense approval | 71% | 100% |
| 07 ops dashboard | 33% | 100% |
| 08 company settings | 67% | 100% |
| **All** | **56%** | **100%** (16/16 reviews, every item) |

Because 100% is suspicious, six hard items were checked against the page source. Each one matched the reviewer's evidence:

- the 01 "select all matching" handler (`all-matching`);
- the indeterminate header checkbox in 01 run-2;
- the 03 run-2 error summary, which shows only when there are 3 or more errors (`if (all.length < 3)`);
- the dirty-state dialog and `beforeunload` in 04 run-1;
- the pre-filtered links in 07 run-1 (`shipments.html?status=late`).

## 5. Template tells (16 main reviews)

| Tell | RED | GREEN |
|---|---|---|
| tracked-uppercase-labels | 10/16 | 0/16 |
| navy-sidebar-indigo-accent | 8/16 | 0/16 |
| rainbow-status | 4/16 | 0/16 |
| oversized-radius | 3/16 | 0/16 |
| initials-avatar-non-person | 2/16 | 0/16 |
| card-in-card | 2/16 | 0/16 |
| kpi-icon-tiles | 1/16 | 0/16 |

Source check: `indigo-*` classes appear in 28/40 RED pages and 0/40 GREEN pages. GREEN shells are a light sidebar with a blue-700 accent (`01-orders-list/run-1.png`, `07-ops-dashboard/run-2.png`).

## 6. Held-out briefs (09 stock movements, 10 leave request, 11 supplier detail)

These checklists were written after the skill and never fed back into it.

| | RED | GREEN |
|---|---|---|
| Median score | 79 | 98 |
| Median violated rules | 3 | 0.5 |
| Runs clean on hard metrics | 50% | 100% |
| text-contrast · uppercase-text · row-two-line · surface-shadow | 83% · 50% · 100% · 33% | 0% · 0% · 0% · 0% |
| numeric-align | 0% (0/1) | 67% (2/3) — see §7 |
| icon-button-name | 0/6 | 1/6 (an empty dialog button in 09 run-2) |
| Checklist: 09 · 10 · 11 · all | 33% · 28% · 44% · **35%** | 78% · 78% · 61% · **72%** |
| Tells | 4 uppercase, 3 navy/indigo, 2 rainbow, 2 initials avatar, 1 radius, 1 card-in-card | 1 initials avatar (11 run-2) |

Held-out items still failing in both GREEN runs:

| Item | Why | Skill-addressable? |
|---|---|---|
| 09 #6 running balance / on-hand column | the page models documents, not stock lines | domain knowledge, no |
| 10 #4 half day on start **and** end date | one shared day-part select, only for single-day requests | domain knowledge, no |
| 10 #9 save as draft | leave warning is there; no draft action | partly (a "long forms offer Save draft" rule) |
| 11 #4 email and phone as links | `mailto:` present in one run, `tel:` missing in both | yes, generic detail-page rule |
| 11 #6 expired / expiring items first | status is colour + text, but rows keep data order | yes, generic "attention first" ordering |

Also failing in one of two runs:

- 09 #4: transfer quantities are unsigned.
- 09 #9: an unnamed dialog button.
- 11 #2: Edit was made the primary action instead of Create purchase order.
- 11 #8: the overview and performance sections have no empty state.

## 7. Failures F1–F13 from RED

| ID | RED evidence | GREEN status | GREEN evidence |
|---|---|---|---|
| F1 contrast | audit 68% | **Fixed** (main 0/40, held-out 0/6) | `01-orders-list/run-1.png` |
| F2 list workflow | 01 checklist 60%, 4 items 0/2 | **Fixed** (01 100%; held-out 09 #8 2/2) | `01-orders-list/run-1.png` |
| F3 missing states | 0/2 in 01, 02, 05, 07 | **Fixed** (07 100%, 05 100%); held-out 11 #8 1/2 | `07-ops-dashboard/run-2.png` |
| F4 save model | 03 63%, 04 36% | **Fixed** (03, 04 100%); held-out 10 #9 warning yes, draft no | `03-invoice-form/run-1.full.png` |
| F5 stacked / tall rows | two-line 33%, height 24% | **Fixed** (3%, 0%; median 40–41px) | `01-orders-list/run-1.png` |
| F6 uppercase labels | audit 73%, reviews 10/16 | **Fixed** (0/40, 0/16) | `01-orders-list/run-1.png` |
| F7 navy + indigo shell | reviews 8/16 | **Fixed** (0/16; indigo classes 0/40) | `07-ops-dashboard/run-2.png` |
| F8 record header / overflow / avatars | 02 50% | **Fixed on main** (02 100%); held-out 11 #2 1/2, initials avatar 1/6 | `02-customer-detail/run-1.png` |
| F9 audit / impact context | 04 items 0/2 | **Fixed** (04 #5, #6 2/2) | `04-role-permissions/run-1.full.png` |
| F10 dashboard charts and drill-down | 07 33% | **Fixed** (07 #3, #4 2/2) | `07-ops-dashboard/run-2.png` |
| F11 numeric alignment on detail/forms | numeric-align 23%, tabular 18% | **Improved** (7%, 0%); remaining hits are headers (§8) | `01-orders-list/run-2.png` |
| F12 card shadows | audit 35% | **Fixed** (0/40; no shadow on the new sticky bars) | `03-invoice-form/run-1.png` |
| F13 rainbow status | reviews 4/16 | **Fixed** (0/16) | `01-orders-list/run-1.png` |

## 8. Regressions and new side effects

1. **12px form labels on settings pages.** font-size-base fails in 08 (3/5) and 07 (1/5); in 08 run-2, 59% of text is 12px.
   - Every field label (`text-xs font-medium`) and help line is 12px.
   - Cause: no file states the field-label size. SKILL.md's replacement table says "12px medium for small labels" (line 143), and navigation-layout.md gives group labels 12px. forms.md uses shadcn `<Label>`, which is 14px only implicitly.
   - Three of the five 08 generators read forms.md and still used 12px labels.
2. **Visible demo-state switchers.** About 15/40 GREEN pages ship a visible control for loading, empty and error states (01 ×4, 02 ×3, 04 ×1, 07 ×4, 08 ×3). An example is "Demo data state: Normal" in the top bar of `01-orders-list/run-1.png`.
   - A text search found 22 GREEN pages that mention demo or simulated states (7 of those are code comments) and 2 RED pages.
   - This is a side effect of the new Mock data rule ("make each state reachable").
   - Reviewers did not count it as a tell, but in a product it is debug UI.
3. **numeric-align on sortable numeric headers** (01 runs 2 and 5; held-out 09 run-2). The `<th>` is `text-right`, but its label sits in a sort `<button class="inline-flex px-1">`.
   - The label's right edge therefore lands 4px inside the cell, beyond the audit's 2px tolerance.
   - Visually it is aligned. This is a measurement artefact more than a defect.
   - Either the skill names the pattern (padding on the cell, not the button) or the audit measures the button's edge.
4. **Edit as primary on a record page** (held-out 11 run-1): the skill's "one primary action" was followed, but with the wrong action.

## 9. Limitations

- **Main checklists are paraphrased in SKILL.md.** After RED, the recipes were written to close the observed failures, so main-suite 100% partly measures recipe following on known screens. The held-out suite (72%, N = 2 per brief, 6 pages) is the independent estimate. It is small.
- **Reviewers are not blind.** File paths contain `red` / `green`. There is one Sonnet reviewer per page and no inter-rater check. Six evidence claims were verified by hand (§4).
- **"Clean on hard metrics" counts not-applicable rules as clean** (e.g. pages without tables pass the row rules).
- **Small review sample.** Audits cover all 40 runs, but checklist reviews cover runs 1–2 only (one EN, one VI per brief).
- **One generator and one output format.** Sonnet 5.5 only, single HTML with Tailwind Play CDN. Not tested in a real React/shadcn codebase, or with Codex, Cursor or Antigravity agents.
- **What agents read.**

  | File | Generators that read it (of 46) |
  |---|---|
  | SKILL.md | 46 |
  | navigation-layout.md | 31 |
  | tables.md | 17 |
  | feedback-states.md | 15 |
  | forms.md | 11 |
  | permissions-audit.md | 9 |
  | filters-search.md | 6 |
  | dashboards-charts.md | 5 |
  | tokens.md | 0 |
  | scripts/audit.js | 0 |

  So the token recipe for single HTML files is untested; agents used Tailwind palette classes.
- **Trigger rate not measured.** The GREEN prompt tells the agent where the skill is. Real-world use depends on the description triggering the skill, which is a separate test.

## 10. Remaining failures ≥30% → REFACTOR candidates (Task 12)

| # | Failure | Rate | Proposed wording fix | Contaminates held-out? |
|---|---|---|---|---|
| R1 | 12px form labels (08) | 3/5 | SKILL.md Foundations and line 143 → "Field labels and help text are 14px (`text-sm`, labels `font-medium`); 12px only for captions, nav group labels, table meta and badges"; forms.md: name the class next to `<Label>` | No |
| R2 | Visible demo-state switcher | ~15/40 | States/Mock data: "make each state reachable through a URL parameter (`?state=loading\|empty\|error`), not a control in the product UI" | No |
| R3 | Sortable numeric header offset | 3 pages (01 runs 2, 5; 09 run-2) | tables.md: padding on the `<th>`, sort button `-mr-1` or no horizontal padding; or relax the audit to the button edge | No |
| R4 | Email/phone not links; expiring items not first | held-out 2/2 | Detail recipe: "email and phone values are `mailto:` / `tel:` links"; lists: "items needing attention sort first" | **Yes** — needs new held-out briefs to re-check |
| R5 | No save-as-draft on long forms | held-out 2/2 | Create/edit: "a long form someone may not finish offers Save draft" | **Yes** |
| — | Running balance, per-date half day | held-out 2/2 | Domain knowledge; leave out of the skill | — |

R1–R3 were applied in skill commit 13a7399 and re-run on briefs 01, 07 and 08 (9 pages). Results, and a new `hidden`-attribute defect found during the re-run, are in `../2026-11-04-refactor/REFACTOR.md`.

**Audit 0.3.0 addendum.** Every run was re-audited with audit 0.3.0, which adds `hidden-overridden`. The tables above are from 0.2.0. Re-auditing changes no spec target and no median in this file. The new rule fires only on GREEN held-out 09 runs 1–2 (an empty bulk bar and an empty dialog shown on load).

The defect is fixed in skill commit bdd9256. In the second micro re-run (01, 07, 08 × 3), all four measured issues are at 0/9: hidden-overridden, font-size-base, numeric-align and visible demo switchers.
