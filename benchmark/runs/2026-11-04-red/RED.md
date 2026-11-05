# RED baseline — management screens without the skill

## 1. Setup

| | |
|---|---|
| Date | 2026-11-04 |
| Generator | Claude Sonnet 5.5 (`claude-sonnet-5-5`), fresh subagent per page, no skills, prompt from `benchmark/GENERATION.md` |
| Briefs × runs | 8 briefs × 5 runs = 40 pages (runs 1, 3, 5 EN prompt; runs 2, 4 VI prompt) |
| Output format | Single HTML file, Tailwind CDN, vanilla JS, mock data |
| Audit | `audit.js` 0.1.0, Playwright 1.64.1 / Chromium, 1440×900, settled DOM, all 40 audited, 0 failures, Tailwind loaded on every page |
| Checklist review | 16 reviews (run-1 EN + run-2 VI of each brief), Claude Sonnet 5.5, protocol `benchmark/REVIEW.md` |
| Incidents | One generator (01, run-4) hung >20 min without writing; stopped and re-dispatched with the identical prompt |

## 2. Audit results

Rates are `violated / applicable` runs; `n/a` = the rule measured nothing on those pages (e.g. no table). Full data: `summary.json`, `summary.md`.

| Rule | All runs | 01 list | 02 detail | 03 form | 04 perms | 05 import | 06 approval | 07 dashboard | 08 settings |
|---|---|---|---|---|---|---|---|---|---|
| text-contrast | **68% (27/40)** | 100% | 60% | 100% | 100% | 60% | 40% | 40% | 40% |
| surface-shadow | **35% (14/40)** | 100% | 0% | 100% | 0% | 40% | 20% | 0% | 20% |
| table-row-two-line | **33% (11/33)** | 100% | 0% | 0% | 80% | n/a | 0% | 0% | 50% |
| table-row-height | 24% (8/33) | 0% | 40% | 100% | 0% | n/a | 0% | 0% | 25% |
| numeric-align | 23% (5/22) | 0% | 60% | 40% | n/a | n/a | 0% | 0% | n/a |
| tabular-nums | 18% (4/22) | 0% | 60% | 20% | n/a | n/a | 0% | 0% | n/a |
| radius-scale | 15% (6/40) | 20% | 0% | 20% | 0% | 40% | 0% | 20% | 20% |
| uppercase-tracking | 13% (5/40) | 80% | 20% | 0% | 0% | 0% | 0% | 0% | 0% |
| font-size-base | 3% (1/40) | | | | | | | | |
| type-scale | 3% (1/40) | | | | | | | | |
| target-size | 3% (1/40) | | | | | | | | |
| no-backdrop-blur | 3% (1/40) | | | | | | | | |
| table-above-fold | 0% (0/5) | | | | | | | | |
| icon-button-name | 0% (0/40) | | | | | | | | |
| no-gradient | 0% (0/40) | | | | | | | | |
| emoji-icon | 0% (0/40) | | | | | | | | |
| single-primary-action | 0% (0/21) | | | | | | | | |
| **Median score** | **86** | 78 | 76 | 66 | 86 | 86 | 100 | 92 | 78 |
| Median row height | | 61px | 45px | 56.5px | 61px | — | 41px | 39px | 53.5px |
| Checklist pass rate | **56%** | 60% | 50% | 63% | 36% | 67% | 71% | 33% | 67% |

Dominant text size was 14px in every brief; median radius count 2–3.

**Contrast detail:** 27 runs, example ratios median 3.75:1 (min 1.48, max 4.47). Typical failures are muted grey text — `text-slate-400` on white, `text-slate-500` on tinted (`slate-50/100`) or dark sidebar surfaces, small labels on tinted badges.

**Shadow detail:** almost every hit is Tailwind `shadow-sm` (`rgba(0,0,0,.05) 0 1px 2px`) on bordered cards.

## 3. Checklist results

Pass rate per brief is in the table above (overall 56%, 16 reviews). Items failing in **both** reviewed runs (0/2), grouped:

| Area | Items that failed 0/2 |
|---|---|
| List (01) | KPI cards / strip above the orders table · filters without removable chips + clear-all · no "select all N matching" · no distinct no-results state with clear-filters |
| Detail (02) | secondary actions not in an overflow menu · empty sections without next step · initials avatars for the company |
| Form (03) | no blur+submit validation with error summary/focus · Save disabled before submit · no sticky Save/Cancel + unsaved-changes warning |
| Permissions (04) | no explicit save with dirty indicator + leave warning · delete role without naming affected users · no "last changed by / audit history" |
| Import (05) | no progress / background continuation / created-updated-failed summary |
| Approval (06) | attachments without type + size + preview/download |
| Dashboard (07) | pie/donut charts or unlabeled axes · needs-attention items don't link to filtered lists · no loading/empty states per widget |
| Settings (08) | no grouped left navigation |

Items at 1/2: breadcrumb with record name; sections/tabs instead of card stack; matrix accessible names; bulk toggle indeterminate; keyboard/targets; stepper back; preview error download; status vocabulary; approver-only actions with reason; dashboard date-range control; KPI delta with period; one save model; persistent inline errors.

## 4. Template tells (16 reviews)

| Tell | Reviews |
|---|---|
| tracked-uppercase-labels | **10/16** |
| navy-sidebar-indigo-accent | **8/16** |
| rainbow-status | 4/16 |
| oversized-radius | 3/16 |
| initials-avatar-non-person | 2/16 |
| card-in-card | 2/16 |
| kpi-icon-tiles | 1/16 |
| greeting-header, gradient, glass, emoji-icon, hover-lift, decorative-chart, sidebar-promo-card, delta-pill-without-period | 0/16 |

Note: the audit's `uppercase-tracking` (13%) under-counts what reviewers see (63%) because its threshold (≥0.04em) misses `uppercase tracking-wide` (0.025em) and untracked uppercase table headers.

## 5. Already good — do not spend SKILL.md lines on these

| Evidence | Behaviour Sonnet already gets right |
|---|---|
| audit ≤3% | 14px body text, small type scale, icon buttons named, 24px targets, no gradients, no glass, no emoji, one filled primary action per header |
| checklist 2/2 | visible labels above fields, sized fields, required asterisks, line items with right-aligned totals, currency/locale formatting, absolute timestamps in timelines, header with one primary action, status tabs with counts, bulk header checkbox + count bar, destructive bulk confirm with count, approval step details, Approve primary / Reject with reason, CSV mapping + template download, danger zone with typed confirmation, localization preview |

These go to `references/` (for completeness) or nowhere.

## 6. Confirmed failures — SKILL.md must address

| # | Failure | Evidence | Screenshot examples |
|---|---|---|---|
| F1 | Muted text below 4.5:1 (slate-400 on white; slate-500 on tinted/dark surfaces) | audit 68% | `01-orders-list/run-1.png`, `03-invoice-form/run-2.png` |
| F2 | List pages missing the list workflow: KPI strip above table, no filter chips/clear-all, no select-all-matching, no no-results state | checklist 0/2 ×4 | `01-orders-list/run-1.png`, `01-orders-list/run-2.full.png` |
| F3 | Missing states: empty sections, no-results, widget loading/empty, import progress/summary | checklist 0/2 in 01, 02, 05, 07 | `07-ops-dashboard/run-2.full.png`, `05-csv-import/run-1.full.png` |
| F4 | Edit/save model: Save disabled before submit, no validation summary, no sticky actions, no dirty indicator/leave warning | checklist 0/2 in 03 and 04 | `03-invoice-form/run-1.full.png`, `04-role-permissions/run-1.png` |
| F5 | Stacked two-line rows and tall rows (61px median on list/permissions; 100% two-line on orders) | audit 33% / 24% | `01-orders-list/run-3.png`, `03-invoice-form/run-1.png` |
| F6 | Tracked uppercase labels and table headers | reviews 10/16 | `01-orders-list/run-1.png` |
| F7 | Template shell: navy sidebar + indigo accent | reviews 8/16 | `02-customer-detail/run-1.png` |
| F8 | Record pages: secondary actions not in overflow, initials avatars for companies, breadcrumb without record name | checklist 0/2–1/2 | `02-customer-detail/run-2.png` |
| F9 | Audit/impact context missing: who changed what, how many users a delete affects | checklist 0/2 in 04 | `04-role-permissions/run-2.full.png` |
| F10 | Dashboard chart choice and drill-down: pie/donut, unlabeled axes, attention items not linked | checklist 0/2 in 07 | `07-ops-dashboard/run-1.full.png` |
| F11 | Numeric cells on detail/form pages not right-aligned / tabular (lists are fine) | audit 23% / 18%, concentrated in 02 and 03 | `02-customer-detail/run-3.png` |
| F12 | Card drop shadows (`shadow-sm`) instead of border-only surfaces | audit 35% | `03-invoice-form/run-1.png` |
| F13 | Rainbow status palettes | reviews 4/16 | `01-orders-list/run-1.png` |

## 7. Surprises

- **The visual "AI slop" largely did not appear.** Sonnet 5.5 produced no gradients, glass, emoji icons or greeting headers, kept 14px text and one primary action. The earlier Opus baselines (`docs/research/baseline/`) showed more decoration. The skill's value is therefore mostly in **workflow, states, density and contrast**, not in banning decoration.
- **Checklist failures dwarf audit failures:** median audit score 86 but checklist pass 56%. The measurable rules are the smaller part of the problem.
- **Contrast is the single most common measurable failure** (68%), driven by muted grey text — not covered as a headline rule in spec §8 draft (it was buried in the a11y rule).
- **Dashboard and permissions briefs are the weakest** (33% and 36% checklist pass).
- Not observed at all: page header with >1 primary, emoji, gradients, icon-only buttons without names → spec §8 rules 7, 10 (gradient part), 14, 21 are not needed in SKILL.md.

## 8. Decisions for Plan B

Spec §8 hard rules:

| # | Rule (spec §8) | Decision | Evidence |
|---|---|---|---|
| 1 | Body/table text 13–14px | references (tokens) | audit 3% |
| 2 | Row height 32–48 / two-line ≤64 | **keep** — prefer single-line rows, 40px | audit 33% / 24% (F5) |
| 3 | Numbers right-aligned, tabular, units in header | **keep (short)** — incl. detail/form tables | audit 23% / 18% (F11) |
| 4 | Left-align text, no centred data | references | not measured |
| 5 | Default sort + aria-sort | references | not measured |
| 6 | List pages: no KPI cards; table first | **keep** (list recipe) | checklist 0/2 (F2) |
| 7 | Exactly one primary action | drop | audit 0%, checklist 2/2 |
| 8 | ≤3 radii, ≤8px | tokens cap + one foundations line | audit 15%, reviews 3/16 |
| 9 | Cards border, no shadow | **keep (foundations line)** + tokens | audit 35% (F12) |
| 10 | One accent; no gradient/blur | **keep accent part** (neutral shell, accent from DESIGN.md); drop gradient/blur | reviews 8/16 navy+indigo (F7); gradient 0% |
| 11 | Status vocabulary 5 tones + text | **keep** | reviews 4/16 rainbow, checklist 1/2 (F13) |
| 12 | Empty / no-results / loading / error states | **keep (strong)** | checklist 0/2 ×4 (F3) |
| 13 | Bulk selection incl. select all N | **keep only "select all N matching"** | checklist 0/2; rest 2/2 |
| 14 | Row actions ≤2, icon names | drop | audit 0%, checklist 2/2 |
| 15 | Destructive confirm names object + consequence | **keep (impact counts)** | 04 delete 0/2 (F9); bulk cancel 2/2 |
| 16 | Forms: labels, widths, *, validation, never disable Save, dirty warning | **keep save/validation/dirty part**; drop labels/widths/* | 0/2 vs 2/2 (F4) |
| 17 | Filter/sort/page state in URL | references | not checked |
| 18 | Intl formatting, absolute dates, "—" | references (`data-formatting`, vi-VN) | checklist 2/2 |
| 19 | Permissions: hide vs disable + reason | **keep (short)** — explain unavailable actions | checklist 1/2 |
| 20 | A11y: contrast, focus, 24px, keyboard | **keep contrast as a headline rule** (muted text ≥4.5:1); rest → references | audit 68% (F1); targets 3% |
| 21 | One icon set, no emoji, no icon tiles | drop | audit 0%, reviews 1/16 |
| 22 | Avatars only for people | **keep** (detail recipe) | checklist 0/2 (F8) |

Template tells for SKILL.md: **tracked uppercase labels (10/16), navy sidebar + indigo accent (8/16), rainbow status (4/16)**. Everything else → `references/anti-patterns.md`.

New content to add (not in spec §8 draft): audit/impact context on record and permission screens (F9), dashboard chart choice + drill-down links (F10), grouped settings navigation, import progress + result summary.

Tooling follow-ups (do before the GREEN run, then re-audit RED from `*.rendered.html` so both use the same tool version):
- `uppercase-tracking`: also flag uppercase labels/table headers with any positive letter-spacing (reviewers 63% vs audit 13%).
- Consider an audit check for a KPI/stat strip above the main table on list pages (currently checklist-only).

## Limitations

- One generator model (Sonnet 5.5), one output format (single-file HTML + Tailwind CDN); real projects (Next.js + shadcn) are tier 2.
- Checklist reviewed on 2 of 5 runs per brief, by an LLM of the same family as the generator, without human calibration; item-level rates rest on n=2.
- The audit sees only the initial state (closed drawers/modals, first wizard step); later states are judged only by reviewers reading code.
- Rendered snapshots lose canvas pixels, JS-set input state, CSSOM-inserted rules and shadow DOM.
- `tailwindLoaded` integrity check only recognises `cdn.tailwindcss.com`.
- Content injected after the settle window can be missed; nav controls are excluded from the header's primary count.
- `passRate` pools items across reviews (weighted by item count, not by run).

## Re-audit with audit 0.2.0

The rule `uppercase-tracking` (letter-spacing of at least 0.04em) became `uppercase-text`: any text with `text-transform: uppercase` and four or more letters warns, tracked or not, because the spec rule is sentence case everywhere.

| | All runs | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 |
|---|---|---|---|---|---|---|---|---|---|
| uppercase-text | 73% (29/40) | 100% (5/5) | 100% (5/5) | 100% (5/5) | 80% (4/5) | 0% (0/5) | 80% (4/5) | 60% (3/5) | 60% (3/5) |

The old rule flagged 13% (5/40); reviewers saw it in 63% of reviews. The median score moved from 86 to 82 (per brief 01 to 08: 78, 76, 62, 82, 86, 96, 90, 76).

Pages were re-loaded from the Tailwind CDN for this re-audit, so date-based mock data may differ from the first audit. The GREEN run uses this same audit version.
