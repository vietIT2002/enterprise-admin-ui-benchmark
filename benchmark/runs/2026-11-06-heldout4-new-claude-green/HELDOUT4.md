# HELDOUT4 — does a check-before-finish pass make agents apply the rules?

HELDOUT3 found that pages built with v0.5.8 missed many UI rules the skill already states. Traces showed why: the agent wrote the page once and never edited it.

The candidate changes `SKILL.md` in four ways (commit 0742b06 in the development repository, reverted in 16cbb10):
- a domain-rules step;
- recipes that name the references to open;
- a "check before you finish" pass that fixes misses with edits;
- result counts and row semantics in "Every screen ships with".

This run compares three arms on six new briefs, all reviewed blind in one pool:
- no skill;
- v0.5.8;
- the candidate.

## Setup

| | |
|---|---|
| Briefs | `26-sales-pipeline-report`, `27-delivery-note-print`, `28-shift-roster`, `29-support-ticket-board`, `30-product-category-tree`, `31-user-access-admin`. A separate agent that never read the skill wrote them, and they were committed (5bcc126) before any page was built. Whoever changed the skill did not read the checklists until the run was over |
| Arms | No skill · v0.5.8 (`git archive e270586`) · the candidate. Claude Sonnet 5.5 at default effort, English prompt, one page per arm per brief |
| Review | `blind-review.mjs --seed 20261108`: all 18 pages coded and reviewed in one pool, one fresh reviewer per page. Key: [`2026-11-06-heldout4-blind/key.json`](../2026-11-06-heldout4-blind/key.json) |
| Audit | `audit.js` 0.5.1 |
| Decision rule (set before the run) | Ship 0.6.0 only if the candidate beats v0.5.8 by at least 5 of 54 items, is not lower on UI behaviour, and costs at most 1.4× per page |

**Incident.** 8 of the 12 pages with the skill were written to a sibling of the work folder (`<work>-green-<brief>-run-1`) instead of inside it. The agent joined the two folder names with a hyphen instead of a path separator.
- **How many:** all 6 candidate pages, 2 of the 6 v0.5.8 pages, and none of the pages without the skill. None of the 11 pages with the skill built the day before (HELDOUT3 and the second round of new screen types) were affected.
- **Recovery:** all 8 pages were complete. They were copied into place unchanged, apart from the usual redaction, and each is marked `recovered` in `bench-usage.json`. `bench.mjs` now finds and recovers such pages itself (c2d3718).
- **Cause:** unknown. Claude Code auto-updated to 2.1.201 during the run, but the first misplaced page (candidate, brief 27) was written at 08:16, before the update at 08:36. That the candidate was hit 6 of 6 times may be chance, or the candidate may change how the agent handles the path. This is worth a check before the candidate is used.

## Results

| Brief | No skill | v0.5.8 | Candidate | Audit score |
|---|---|---|---|---|
| 26 Sales pipeline report | 0/9 | 5/9 | 4/9 | 52 · 90 · 100 |
| 27 Delivery note, print | 2/9 | 3/9 | 3/9 | 68 · 68 · 66 |
| 28 Weekly shift roster | 1/9 | 1/9 | 3/9 | 52 · 76 · 76 |
| 29 Support ticket board | 2/9 | 2/9 | 3/9 | 76 · 80 · 90 |
| 30 Product category tree | 2/9 | 6/9 | 8/9 | 70 · 90 · 90 |
| 31 User access admin | 1/9 | 4/9 | 2/9 | 58 · 100 · 86 |
| **Checklist** | **8/54 (15%)** | **21/54 (39%)** | **23/54 (43%)** | median 63 · 85 · 88 |

Template tells seen by the reviewers: 19, 1 and 2.

Split by kind of item, with the same rule as [HELDOUT3](../2026-11-06-heldout3-claude-green/HELDOUT3.md):
- **UI behaviour (U):** states, counts, formatting, keyboard and screen-reader access, confirmations, print, export.
- **Domain content (D):** stage probabilities, signature boxes, contracted hours, SLA pauses, self-protection of the admin account.

Items in order: 26 `DDDUUDUUU`, 27 `DDUDDDUUU`, 28 `UUDDDDUUU`, 29 `UDDDUUUUU`, 30 `UUUDUUUUU`, 31 `DUUUUDDUU`.

| Kind | No skill | v0.5.8 | Candidate |
|---|---|---|---|
| UI behaviour (34 items) | 4 (12%) | 15 (44%) | **18 (53%)** |
| Domain content (20 items) | 4 (20%) | 6 (30%) | 5 (25%) |

## Run 2: Vietnamese prompts for both skill arms

Run 1 left the candidate 2 items ahead, within noise, so both arms with the skill built every brief once more from the Vietnamese prompt. The 12 new pages were reviewed blind in a pool of their own (`blind-review.mjs --runs 2 --seed 20261109`, key in [`2026-11-06-heldout4-blind-vi`](../2026-11-06-heldout4-blind-vi/key.json)).

| Brief | v0.5.8 EN · VI | Candidate EN · VI |
|---|---|---|
| 26 Sales pipeline report | 5 · 2 | 4 · 5 |
| 27 Delivery note, print | 3 · 1 | 3 · 2 |
| 28 Weekly shift roster | 1 · 4 | 3 · 2 |
| 29 Support ticket board | 2 · 3 | 3 · 2 |
| 30 Product category tree | 6 · 6 | 8 · 4 |
| 31 User access admin | 4 · 4 | 2 · 5 |
| **Run 1 · run 2** | 21/54 · 20/54 | 23/54 · 20/54 |
| **Both runs** | **41/108 (38%)** | **43/108 (40%)** |
| UI behaviour (68 items) | 32 (47%) | 32 (47%) |
| Domain content (40 items) | 9 (23%) | 11 (28%) |
| Median audit score | 88 | 88 |
| Median cost a page | $2.04 | $2.87 (1.41×) |
| Pages written to the wrong folder | 3 of 12 | **12 of 12** |

- **No difference.** Over both runs, the candidate is 2 items ahead out of 108. UI behaviour is identical at 47%. The +3 UI items of run 1 did not hold.
- **Large noise between runs.** One page can move by 3–4 items between runs (candidate brief 30: 8 then 4; v0.5.8 brief 28: 1 then 4). A real effect of +5 items in 54 would need more than two runs per arm to show.
- **The candidate costs more:** 1.41×, above the 1.4× limit. It also took longer: up to 30 minutes and 182k output tokens for one page.
- **The candidate wrote every page to the wrong folder:** 12 of 12, against 3 of 12 for v0.5.8 and 0 of 6 without the skill. Something in the candidate, probably the longer sessions it causes, makes the agent lose the output path it was given. In a real project that would put files in the wrong place.

**Decision: the candidate fails the rule on gain and on cost, and it brings a regression. It was reverted (16cbb10).** Keep the tools: `blind-review.mjs`, the run filter, sibling-folder recovery and merged usage files.

## Reading

- **v0.5.8 against no skill repeats HELDOUT3.** Here 15% → 39%; HELDOUT3 gave 22% → 48%. Over the 12 independent screens of both suites, v0.5.8 goes from **20/108 (19%) to 47/108 (44%)**.
- **Run 1 alone:** the candidate against v0.5.8 is +2 items, below the +5 the rule asked for. Run 2 above settles it: no difference.
  - 12 of 54 items changed between the two arms: the candidate gained 7 and lost 5. With one page per brief, that churn is as large as the effect.
  - The direction matches the diagnosis: UI behaviour went from 44% to 53% (+3 items).
  - The domain-rules step did not help: domain items went from 30% to 25%.
- **The check pass does change behaviour.**
  - In the sanity trace (Task 4) the candidate edited its page 1–2 times after the first write and opened the references the recipe named. Earlier traces show no edits.
  - That costs more: a median of $2.68 a page against $1.97 for v0.5.8 (1.36×).

## Cost

| Phase | Cost |
|---|---|
| Generation, no skill (6) | $2.21 |
| Generation, v0.5.8 (6) | $13.48 (median $1.97 a page) |
| Generation, candidate (6) | $16.38 (median $2.68 a page) |
| Blind reviews (18) | $8.43 |
| Run 2: v0.5.8 (6, Vietnamese) | $11.00 |
| Run 2: candidate (6, Vietnamese) | $15.19 |
| Run 2: blind reviews (12) | $6.28 |
| **Total** | **$72.97** |

The two sanity traces and a $0.12 path test come on top; the trace tool did not record the traces' cost.

## Limitations

- **Sample.** Two pages per skill arm per brief (EN and VI), and one page per brief without the skill (EN). A difference of a few items is within noise.
- **Review.** One blind reviewer per page, from the same model family.
- **Classification.** The U/D split is one person's reading.
- **Incident.** 8 pages were written to the wrong folder and recovered. Nothing shows the misplaced path changed what the agent wrote.

## Files

- Pages, audits and blind reviews: [`heldout4-base-claude-red`](../2026-11-06-heldout4-base-claude-red/), [`heldout4-base-claude-green`](../2026-11-06-heldout4-base-claude-green/) (v0.5.8) and this folder (candidate).
- [COMPARE](../2026-11-06-heldout4-base-claude-green/COMPARE.md) (no skill → v0.5.8) and [COMPARE](COMPARE.md) (v0.5.8 → candidate).
- Sanity trace: [`2026-11-06-trace-compliance`](../2026-11-06-trace-compliance/).
