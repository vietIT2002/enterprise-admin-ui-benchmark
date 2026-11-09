# SCREEN-A: page templates and a checker in the loop

The research for the 10x strategy (`docs/research/2026-11-07-chien-luoc-10x.md`, development repository) predicted that an executable checker would raise compliance, and that templates would do the same. In the predicted loop the agent runs a check that names each failure, fixes it, and runs the check again. Templates would make the most-missed rules the default.

Phase A built three things:
- `scripts/check.mjs`: the audit plus behaviour checks for states, result count, export count, print, confirmation and a status region;
- three page templates (list, detail, form) that pass the checker;
- a `SKILL.md` workflow that starts from a template and runs the checker until it passes.

This screen measures that workflow against v0.5.8.

## Setup

| | |
|---|---|
| Briefs | HELDOUT4 `26`–`31`, EN and VI (12 pages). These briefs are seen: their checklists were read after HELDOUT4, so this is a screen, not a held-out claim |
| Arm | Skill at 1677eb5 (templates + checker), `bench --checks` so the agent may run `node`. Claude Sonnet 5.5, default effort |
| Comparison | v0.5.8 on the same 12 briefs and runs, from HELDOUT4 |
| Review | Blind (`--blind --seed 20261110`), one fresh reviewer per page |
| Trace first | In two traces on HELDOUT3 briefs, the agent started from the templates, ran `check.mjs`, fixed what it reported and re-ran it until it passed |

## Results

| Brief | v0.5.8 EN · VI | Phase A EN · VI |
|---|---|---|
| 26 Sales pipeline report | 5 · 2 | 3 · 4 |
| 27 Delivery note, print | 3 · 1 | 2 · 1 |
| 28 Weekly shift roster | 1 · 4 | 2 · 3 |
| 29 Support ticket board | 2 · 3 | 4 · 4 |
| 30 Product category tree | 6 · 6 | 6 · 5 |
| 31 User access admin | 4 · 4 | 4 · 4 |
| **Checklist** | **41/108 (38%)** | **42/108 (39%)** |
| UI behaviour (68) | 32 (47%) | 33 (49%) |
| Domain content (40) | 9 (23%) | 9 (23%) |
| Median audit score | 88 | **100** |
| Median cost a page | $2.04 | **$3.36 (1.65×)** |

- 17 items changed between the arms: Phase A gained 9 and lost 8.
- **The items the checker targets did not improve.** 16 items cover empty, loading and error states, export or print: v0.5.8 passed 11 of them and Phase A passed 10. The reviewers asked for more than the checker can see:
  - an export of deal-level rows rather than the summary;
  - a document-level error and not-found state, not only per-region states;
  - a first-use action that fits the screen ("Copy last week"), not a generic button.
- **The audit went to 100** because the agent fixed what `check.mjs` reported. The independent checklist did not move.
- **Blinding was imperfect.** Two pages (29 EN, 30 VI) named the skill in an HTML comment, copied from the comment style of the templates. Only Phase A pages were in this review pool, so no reviewer could compare arms, and any bias would favour Phase A, which still showed no gain. The templates no longer name the skill.
- **Cost and time grew.** Pages took up to 40 minutes and 112k output tokens, and generation cost $45.23 against an estimate of about $24. One page was written to a sibling folder and recovered.

## Reading

The checker loop works as a mechanism: agents run it and fix what it names. But what it names is a proxy, and the agents already met most of the proxy's targets. The independent checklists ask for specifics of each screen that a generic checker cannot verify. So the gap between 39% and 100% is not mainly a compliance gap that a checker can close.

This is the second intervention that did not move the blind checklist beyond v0.5.8. The first was a prose check-before-finish pass (HELDOUT4). On demanding independent checklists, v0.5.8 seems to be near what instructions and generic checks can reach. The remaining misses are screen-specific and domain-specific requirements that the prompt does not state.

## Decision (proposed)

- **Do not make the template-and-checker workflow mandatory in `SKILL.md`.** It costs 1.65× and gives no measured gain.
- **Keep `check.mjs` and the templates as optional tools.** For users, the checker gives a fast, deterministic score in a terminal or in CI, and the templates are a correct starting point. Neither needs the agent to loop.
- **Shift the effort to distribution.** The measured value of v0.5.8 (19% → 44% on 12 independent screens) is what the skill offers today.

## Cost

| Phase | Cost |
|---|---|
| Two traces (Task "trace with the checker") | $4.10 |
| Generation, 12 pages | $45.23 |
| Blind reviews, 12 | $5.51 |
| **Total** | **$54.84** |
