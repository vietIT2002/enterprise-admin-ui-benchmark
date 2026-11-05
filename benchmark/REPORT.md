# Benchmark report — enterprise-admin-ui v0.5

Does the skill make AI coding agents build better management screens? We asked the same model to build the same screens with and without the skill. Each result was measured with an automated audit and a written acceptance checklist.

Detailed reports:
- [RED](runs/2026-11-04-red/RED.md) (no skill)
- [GREEN](runs/2026-11-04-green/GREEN.md) (with the skill)
- [REFACTOR](runs/2026-11-04-refactor/REFACTOR.md) (two fix rounds)
- [V05](runs/2026-11-05-v05/V05.md) (v0.5 verification)
- [TRIGGER](runs/2026-11-05-trigger/TRIGGER.md) (does the skill load on its own?)
- [HELDOUT2](runs/2026-11-05-green-heldout2/HELDOUT2.md) (three new briefs after the 0.5.2 rules)
- [NEXT](runs/2026-11-05-next-green/NEXT.md) (a real Next.js + shadcn/ui codebase)
- [CODEX](runs/2026-11-05-codex-green/CODEX.md) (Codex CLI as the agent)

![Orders list before and after](../docs/img/before-after-01-orders-list.png)

## Contents

- [Setup](#setup)
- [Results](#results)
- [What changed on the screens](#what-changed-on-the-screens)
- [Fix rounds after GREEN](#fix-rounds-after-green)
- [v0.5 verification](#v05-verification)
- [Trigger rate](#trigger-rate)
- [A real codebase and a second agent](#a-real-codebase-and-a-second-agent)
- [Limitations](#limitations)
- [Reproduce](#reproduce)

## Setup

| | |
|---|---|
| Generator | Claude Sonnet 5.5, a fresh subagent per page; prompts in [GENERATION.md](GENERATION.md) |
| Main suite | 8 briefs (orders list, customer detail, invoice form, role permissions, CSV import, expense approval, operations dashboard, company settings) × 5 runs = 40 pages per condition. Runs 1, 3, 5 use an English prompt; runs 2, 4 use Vietnamese |
| Held-out suite | 3 briefs written after the skill (stock movements, leave request, supplier detail) × 2 runs = 6 pages per condition |
| Output | One HTML file per page: Tailwind Play CDN, vanilla JS, mock data |
| Audit | [`audit.js`](../skills/enterprise-admin-ui/scripts/audit.js) in Chromium at 1440×900. Typography, radius, row height, numeric alignment, names, targets, contrast, decoration, primary actions, hidden-overridden. Score 100 minus 10 per violated error rule and 4 per warning rule |
| Checklist | 6–10 acceptance items per brief, judged by a separate Sonnet reviewer from source and screenshots ([REVIEW.md](REVIEW.md)). Runs 1–2 of every brief were reviewed |
| Conditions | **RED**: "do the task as you normally would". **GREEN**: "read the skill's SKILL.md first and follow it" |

## Results

### Main suite (40 pages per side, 16 reviews per side)

| Metric | Without skill | With skill |
|---|---|---|
| Median audit score | 82 | **100** |
| Median violated rules per page | 3 | **0** |
| Pages clean on hard metrics (font size, row height, radius) | 68% | **90%** |
| Acceptance checklist pass rate | 56% | **100%** |
| Muted text below 4.5:1 contrast | 68% of pages | **0%** |
| ALL-CAPS labels and headers | 73% | **0%** |
| Card drop shadows | 35% | **0%** |
| Stacked two-line table rows | 33% | **3%** |
| Template tells seen by reviewers (navy + indigo shell, rainbow status, tracked caps…) | 30 across 16 reviews | **0** |

**Caveat.** SKILL.md was written after the RED run, from its failures on these same briefs, so the 100% partly measures how well agents follow the recipes on screens the skill was built around. The held-out suite below is the fairer test.

### Held-out suite (6 pages per side, 6 reviews per side)

| Metric | Without skill | With skill |
|---|---|---|
| Median audit score | 79 | **98** |
| Pages clean on hard metrics | 50% | **100%** |
| Acceptance checklist pass rate | 35% | **72%** |

The items still failing were mostly domain knowledge the skill does not carry:
- a running stock balance;
- half days on both the start and end date of a leave request;
- save as draft.

Two were generic gaps: email and phone shown as links, and expiring certificates sorted first.

### Second held-out suite (6 pages per side, 6 reviews per side)

After those gaps, three generic rules were added: contact links, attention-first ordering and save draft. Three new briefs (contract detail, onboarding form, equipment list) were then written and run:

| Metric | Without skill | With skill |
|---|---|---|
| Median audit score | 90 | **100** |
| Acceptance checklist pass rate | 39% | **89%** |
| Items that check the new rules | 5/8 | **8/8** |
| The other 23 items | 35% | **87%** |

The new briefs were written after the rules, so the four targeted items show rule-following, not generalization. Save draft and list ordering also passed without the skill on these briefs. The failures left with the skill were:
- forms laid out on a grid instead of one column (2/2);
- amendments without an approver (2/2);
- one breadcrumb and one empty state.

In 0.5.2 the one-column rule was tightened. A re-run of the onboarding form then passed it on 2/2 pages with an audit score of 100. Each re-run page failed one other item, a phone field without `type="tel"` and a sticky bar that never stuck; 0.5.2 adds a line for each, not yet re-measured. See [HELDOUT2.md](runs/2026-11-05-green-heldout2/HELDOUT2.md).

![Operations dashboard before and after](../docs/img/before-after-07-ops-dashboard.png)

## What changed on the screens

| RED failure | Status with the skill |
|---|---|
| Muted grey text below 4.5:1 | Fixed (0/40) |
| List pages without filter chips, "select all N matching" or a no-results state | Fixed |
| Missing empty, loading and error states | Fixed on the main suite; one held-out section without an empty state |
| Save disabled before submit, no error summary, no unsaved-changes warning | Fixed |
| Stacked rows; median row height up to 61px (53.5–61px on four briefs) | Fixed: one-line rows, median 40–41px |
| Tracked uppercase labels | Fixed |
| Navy sidebar with an indigo accent | Fixed (indigo classes 28/40 → 0/40) |
| Record pages without an overflow menu; initials avatars for companies | Fixed on the main suite; 1/6 held-out pages still used an initials avatar |
| No audit or impact context (who changed what, users affected by a delete) | Fixed |
| Pie or donut charts, unlinked attention items | Fixed |
| Numbers not right-aligned outside lists | Improved (23% → 7%); the remaining hits were sortable headers offset from their numbers, handled in the fix rounds below |
| Card shadows | Fixed |
| Rainbow status colours | Fixed (five-tone vocabulary) |

![Invoice form before and after](../docs/img/before-after-03-invoice-form.png)

## Fix rounds after GREEN

GREEN found side effects. The fixes were re-run on briefs 01, 07 and 08 (9 pages per round):

| Issue | GREEN | After the fix |
|---|---|---|
| 12px field labels on settings pages | 3/5 pages | 0/3, then 0/9 |
| A visible "demo state" switcher, a side effect of the mock-data rule | 11/15 pages | 0/9 (states now come from `?state=`) |
| Sortable numeric headers offset from their numbers | 2/15 | 0/9 |
| An element with the `hidden` attribute still shown, because Tailwind's `flex` overrides `[hidden]` | appeared in round 1 (3/9) | 0/9 (a new audit rule plus one line in SKILL.md) |

After the second round, all 9 pages had a median score of 100, and 100% were clean on hard metrics.

## v0.5 verification

- **Review mode.** Three reviews with the skill reported findings as `path:line — rule — fix`, grouped by severity, with counts. Two reviews with the older SKILL.md wrote prose. Nine cited line numbers were checked and all matched the source.
- **New references.** Three new pages (CSV import in EN and VI, orders list in VI) passed every checklist item (22/22) with a median audit score of 100. Every agent opened `bulk-import-export.md` and `data-formatting.md`, then used the vi-VN locale, `dd/MM/yyyy` dates and currency-in-header columns.

## Trigger rate

In Claude Code (Sonnet 5.5), with user plugins, hooks and MCP turned off, no prompt named the skill:
- the skill loaded on its own for 20/20 management-screen prompts (10 EN, 10 VI), with and without the AGENTS snippet;
- it loaded for 0/10 landing-page prompts.

The spec targets were ≥80% without the snippet, ≥95% with it, and ≤10% false triggers. See [TRIGGER.md](runs/2026-11-05-trigger/TRIGGER.md).

## A real codebase and a second agent

The three held-out briefs from HELDOUT2 were built once more per side, in two new settings:

| Setting | Checklist without → with the skill | Median audit score |
|---|---|---|
| Next.js 16 + shadcn/ui app, Claude Sonnet 5.5 ([NEXT](runs/2026-11-05-next-green/NEXT.md)) | 44% → **93%** | 76 → 90 |
| Codex CLI with `gpt-6.1-sol`, single HTML file ([CODEX](runs/2026-11-05-codex-green/CODEX.md)) | 33% → **96%** | 62 → **100** |

In both settings the gap is about the same as in the HTML held-out suite (39% → 89%). Without the skill, Codex produced the full template look: a navy sidebar with an indigo accent, KPI tiles, a greeting, ALL-CAPS labels and 11–12px text. With the skill, reviewers saw one tell in three pages.

Two findings from the Next.js run:
- **Builds.** With `cacheComponents` on, the default for new Next 16 apps, a page that reads `params` or `searchParams` outside `<Suspense>` fails `next build`, even though `tsc`, `eslint` and `next dev` pass. One GREEN page read `?state=` that way, so 1/3 GREEN routes built against 2/3 RED. SKILL.md and `react-shadcn.md` now cover this; it was not re-measured.
- **Radius.** Both sides lost the `radius-scale` points to the template's 10px shadcn radius, because agents could not edit `globals.css` in this setup.

## Limitations

- **Small samples.** 40 + 6 pages per side, checklist reviews on runs 1–2 only, and 3–9 pages per fix round.
- **Reviewers are not blind.** Run paths contain `red` and `green`. There is one reviewer per page; six claims were verified by hand.
- **The main checklists overlap the skill's recipes.** See the caveat above. The held-out result (35% → 72%) is the estimate for unseen screens.
- **"Clean on hard metrics" counts rules that do not apply as clean.** For example, a page without a table passes the row-height rule.
- **Mostly one model and one output format.** Most pages are single-file HTML from Sonnet 5.5. The Next.js and Codex runs have 3 pages per side each. Not yet measured: Cursor and Copilot, Vietnamese prompts outside the HTML suites, and whether the skill loads on its own in agents other than Claude Code.

## Reproduce

```bash
npm ci
npx playwright install chromium
node benchmark/tools/audit-page.mjs --run benchmark/runs/<folder>
node benchmark/tools/aggregate.mjs benchmark/runs/<folder>
node benchmark/tools/compare.mjs benchmark/runs/<red-folder> benchmark/runs/<green-folder>
```

Generation and review prompts are in [GENERATION.md](GENERATION.md) and [REVIEW.md](REVIEW.md). The briefs, with their checklists, are in [briefs/](briefs/) and [briefs-heldout/](briefs-heldout/).
