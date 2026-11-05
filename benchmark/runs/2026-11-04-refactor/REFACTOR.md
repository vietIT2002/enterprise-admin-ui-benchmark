# REFACTOR micro re-run — R1–R3 (skill commit 13a7399)

Changes tested (see `../2026-11-04-green/GREEN.md` §10):

- **R1:** field labels and help text are 14px (`text-sm`); 12px only for captions, badges, nav group labels and timestamps.
- **R2:** mock states are reached through `?state=empty|error|loading`, not a visible control.
- **R3:** sortable numeric header has the padding on the `<th>` and none on the button.

Setup: Sonnet 5.5, GREEN prompt, briefs 01 / 07 / 08 × runs 1–3 (EN, VI, EN) = 9 pages. Audit 0.2.0, 9/9 audited. No checklist reviews; R1–R3 are measured by audit and source search. Tokens ≈ 0.85M.

| Brief | Measure | GREEN (5 runs) | REFACTOR (3 runs) |
|---|---|---|---|
| 08 settings | font-size-base (12px dominant) | 3/5 | **0/3** (12px share 4–8%) |
| 01 orders | numeric-align (sortable header offset) | 2/5 | **0/3** |
| 01 · 07 · 08 | visible demo-state control | 11/15 | **0/9** (all 9 read `?state=` via `URLSearchParams`) |
| 07 dashboard | font-size-base | 1/5 (12px share 38–47%) | 2/3 (37–52%) |
| 01 · 07 · 08 | element with `hidden` attribute shown by a display class | 0/15 | **3/9** |

## Findings

1. **R1, R2 and R3 worked** on the screens they targeted. Settings pages now use 14px labels and help text (`08-company-settings/run-2.png`). No page shows a demo switcher, and numeric sort headers line up with their numbers.
2. **Dashboards sit on the font-size threshold.** On 07 the 12px text is captions the skill asks for: KPI labels (dashboards-charts.md says 12px), deltas, axis notes, badges, "checked at" times. The 12px share moved from 38–47% to 37–52%, which is within run-to-run noise for N = 3. This is not an R1 regression.
   - **Open:** either make KPI labels and deltas 14px in dashboards-charts.md, or treat the rule as advisory on dashboards.
3. **New defect: `hidden` overridden by Tailwind display classes.** `<div id="dlg" hidden class="fixed inset-0 flex …">` renders, because Tailwind v3 (Play CDN) preflight `[hidden]{display:none}` has the same specificity as `.flex` and loses to it.
   - **Where:**
     - 01 run-3: an empty confirm dialog covers the page on load (`01-orders-list/run-3.png`);
     - 01 run-1: an empty filter-chip row;
     - 08 run-1: the empty state shows next to the data;
     - also GREEN held-out 09 runs 1 and 2: an empty bulk bar and an empty dialog button.
   - **Search:** a DOM search finds 0/40 in RED and 0/40 in GREEN main, but 2/6 in GREEN held-out and 3/9 here. The rise here may come from R2, which leads pages to pre-render more state containers and toggle them. N is small.
   - **Detection:** the audit has no rule for this; it only surfaces when the hidden element contains an unnamed button.
   - **Proposed fix:**
     - SKILL.md Foundations, single-HTML note: toggle visibility with the `hidden` **class** (`el.classList.toggle('hidden', …)`), or add `<style>[hidden]{display:none!important}</style>`.
     - Audit 0.3.0: a `hidden-overridden` rule that flags any element with the `hidden` attribute whose computed `display` is not `none`, then re-audit every run.

## Second re-run — `hidden` fix (skill bdd9256, audit 0.3.0 fbbdb82)

The changes tested:

- **Audit 0.3.0** adds the rule `hidden-overridden`, an error: an element has the `hidden` attribute (but not `until-found`), its computed `display` is not `none`, and it has a non-zero box.
- **SKILL.md Foundations** (single-HTML note) and the tokens.md recipe now add `[hidden] { display: none !important; }` to the page's `<style>`.

Folder `../2026-11-04-refactor2/`: same briefs, runs and prompts as above, 9 pages, ≈ 0.83M tokens.

| Measure (01 · 07 · 08) | GREEN (15) | REFACTOR (9) | REFACTOR2 (9) |
|---|---|---|---|
| hidden-overridden | 0/15 | 3/9 | **0/9** (every page has the `[hidden]` rule) |
| font-size-base | 4/15 | 2/9 | **0/9** |
| numeric-align | 2/15 | 0/9 | **0/9** |
| visible demo-state control | 11/15 | 0/9 | **0/9** |
| median score · runs clean on hard metrics (audit 0.3.0) | 100 · 73% | 90 · 78% (100 under 0.2.0) | **100 · 100%** |

The only remaining hit is a `table-above-fold` warning on one dashboard (07 run-2). That is a warn-only rule and is not measured on dashboards in the aggregate.

## Re-audit of every run with audit 0.3.0

RED, GREEN, both held-out folders and REFACTOR were re-audited with 0.3.0; summaries and COMPARE files were regenerated. The spec §12 results are unchanged:

- **Main suite:** violated rules −100%, 90% clean, checklist 100%.
- **Held-out:** −83%, 100% clean, checklist 72%.

The new rule fires on:

| Run | hidden-overridden |
|---|---|
| RED | 0/0 applicable pages |
| GREEN | 0/2 |
| RED held-out | 0/1 |
| GREEN held-out | **2/2** (09 runs 1–2) |
| REFACTOR | 3/4 |
| REFACTOR2 | 0/9 |
