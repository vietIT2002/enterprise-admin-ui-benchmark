# COST — what the skill costs per page, and where the cost goes

The first run with the one-command benchmark (`npm run bench`). Each page was generated and reviewed by an isolated `claude -p` call (Claude Sonnet, project settings only, no MCP, no Skill tool, no shell). The measured tokens and cost of every call are in `bench-usage.json`; the summary below comes from `benchmark/tools/usage-summary.mjs`.

Briefs 12, 13 and 14 (held-out 2), English prompt, 1 run per side. Total cost of the run: $7.70 (6 generations + 6 reviews).

## Quality

| | Without skill | With skill |
|---|---|---|
| Checklist pass rate | 7/27 (26%) | **25/27 (93%)** |
| Per brief | 22% · 11% · 44% | 100% · 100% · 78% |
| Median audit score (0.5.0) | 62 | **100** |
| Pages clean on hard metrics | 0/3 | **3/3** |
| Template tells seen by reviewers | 13 | 1 |

The gap matches the earlier held-out 2 runs (39% → 89%), the Next.js run (44% → 93%) and Codex (33% → 96%).

## Cost per generated page

| | Without skill | With skill | Ratio |
|---|---|---|---|
| Cost | $0.30 | $1.43 | 4.8× |
| Output tokens | 11.2k | 49.9k | 4.4× |
| Cache writes (new context) | 18.6k | 97.4k | 5.3× |
| Cache reads | 51k | 315k | 6.2× |
| Turns | 2 | 8.7 | 4.3× |
| Time | 88 s | 448 s | 5.1× |

A review costs about $0.42 per page on either side.

## Where the extra cost goes

| Source | Size per page | Share of the extra cost |
|---|---|---|
| Reading the skill: SKILL.md (~4.5k tokens) plus the references the agent opens (3–9k each, typically 3–5 files) | ~20–35k tokens of context | Small: roughly $0.10–0.15 per page |
| A larger page: all states, error summary, leave guard, accessible names | 13–21k tokens vs 4–11k | The cost of the quality gain |
| Output that is not in the final page: reasoning and re-writes over 5–12 turns | output is 2.8–3.4× the page size, vs 1.4× without the skill | **The largest lever** |

Output tokens are the most expensive kind, and they make up most of the difference. Reading the skill is cheap. Gathering references into one file per page type would save under 10%, so it is not the first optimization to make.

**Cost per passing checklist item:** $0.30 / 2.3 items ≈ $0.13 without the skill, and $1.43 / 8.3 items ≈ $0.17 with it. The skill buys about 3.6 times as many acceptance items for about 1.3 times the price per item.

## Breakdown: reasoning, not re-writes

Two GREEN pages were re-run with `stream-json` ([`trace-run.mjs`](../../tools/trace-run.mjs), results in [`2026-11-05-trace/traces.json`](../2026-11-05-trace/traces.json), about $3.55):

| Page | Output tokens | Page written | Hidden reasoning | Writes / edits | Files read |
|---|---|---|---|---|---|
| 12 contract detail | 68.8k | ~21.1k | ~47.7k (69%) | 1 / 0 | SKILL.md + 6 references + `tokens.css` |
| 14 equipment list | 50.3k | ~17.4k | ~32.8k (65%) | 1 / 0 | SKILL.md + 5 references |

Each agent wrote the page once and never edited it, so re-writes are not the cost. About two thirds of the output is reasoning, which the stream does not show but which is billed as output. Both agents also read `tokens.md`, and one read `tokens.css`, although SKILL.md says a Tailwind CDN page can use the palette classes directly.

The lever is therefore reasoning effort, which the user sets, rather than the skill's length. `claude -p` has `--effort`, and `npm run bench` now passes `--effort` through.

## Effort levels

The three GREEN pages were re-run with `npm run bench -- --conds green --effort medium|low`, with reviews. Runs: `2026-11-05-effort-medium-claude-green` and `2026-11-05-effort-low-claude-green`; table from `benchmark/tools/effort-compare.mjs`.

| Effort | Checklist | Median audit | Cost per page | Output per page | Time per page |
|---|---|---|---|---|---|
| default | **25/27 (93%)** | 100 | $1.43 | 49.9k | 448 s |
| medium | 21/27 (78%) | 96 | $0.78 | 19.2k | 171 s |
| low | 21/27 (78%) | 100 | **$0.53** | 10.1k | 89 s |
| *without the skill, default* | *7/27 (26%)* | *62* | *$0.30* | *11.2k* | *88 s* |

What lower effort drops:
- **Kept:** the visual foundations. Type, contrast, radius and the absence of template tells all held at every level.
- **Dropped:** the parts that take the most work:
  - empty, loading and error states for each section;
  - the confirmation dialog for Terminate;
  - "Renew" as the one primary action;
  - the remaining time to expiry;
  - accepted file types and size for uploads;
  - single-line rows: name and code were stacked in one cell.
- **Page size:** the pages were 2–4 times smaller.

Medium did no better than low on these three briefs, and three pages per level is a small sample.

**Cost per passing item:**

| Setting | Cost per item |
|---|---|
| Default effort with the skill | $0.17 |
| Medium with the skill | $0.11 |
| Low with the skill | $0.08 |
| Default effort without the skill | $0.13 |

Even at low effort the skill triples the checklist pass rate (26% → 78%) for $0.23 more per page.

## "Every screen ships with" at low effort

Commit 739301d added a seven-line list near the top of SKILL.md naming what low and medium effort left out. The list covers states, one primary action, confirmation dialogs, single-line rows, dates with the time left, form essentials and announcements. The three GREEN pages were then re-run at `--effort low` (`2026-11-05-ships-low-claude-green`).

| Setting | Checklist | Median audit | Generation attempts | Cost per delivered page |
|---|---|---|---|---|
| Default effort | 25/27 (93%) | 100 | 3 / 3 | $1.43 |
| Low effort | 21/27 (78%) | 100 | 3 / 3 | $0.53 |
| Low effort + list | 22/27 (81%) | 100 | 3 / 4 | $0.73 |

| Checklist items | Without the list | With the list |
|---|---|---|
| 12 contract detail | `PPP.PPP..` | `PPP.PPP.P` |
| 13 onboarding form | `PPPPPPPP.` | `PPPPPPP.P` |
| 14 equipment list | `PPPPPP..P` | `PPPPPP.P.` |

What the list changed:
- **Fixed three of the six items it targets:** the Terminate confirmation (12#9), the announced success message (13#9), and the list states (14#8).
- **Did not fix three items the list names:** states on the contract page (12#8), milestones ordered overdue first (12#4), and the name and code stacked in one cell (14#7).
- **Two items flipped the other way,** which is run-to-run noise: the upload remove button (13#8) and the contrast of a "—" placeholder (14#9).
- **One of four generations ended without writing the page.** The agent replied but never called Write, so the page was generated again. Recording the agent's reply in `bench-usage.json` will show why next time.

At low effort the agent skips work even when it is named near the top. The list helps with some of it, but it does not bring low effort to the default level. With three pages per side, +1 item is within noise.

### A/B on briefs that did not shape the list

The held-out 1 briefs 09–11 were run at `--effort low` with two copies of the skill under neutral paths: `a` with the list and `b` without it. Apart from the list, the copies are identical, and the runs are `2026-11-06-ab-a-claude-green` and `2026-11-06-ab-b-claude-green`.

| | Checklist | Median audit | Cost per page |
|---|---|---|---|
| A, with the list | **15/27 (56%)** | 96 | $0.65 |
| B, without the list | 12/27 (44%) | 90 | $0.58 |

The pass rate is low on both sides because these briefs carry domain items the skill does not cover. Examples are a running stock balance and half days on both ends of a leave request.

Items that differ:
- **Only A passed, item the list targets:** 11#9, the confirmation dialog for deactivating a supplier. B left "Deactivate supplier" as a link with no handler.
- **Only A passed, items related to the list or noise:**
  - 10#2: required and optional fields marked;
  - 11#3: tabs with `role="tablist"`;
  - 09#9: names on icon-only controls, target size and contrast.
- **Only B passed:** 09#7, `aria-sort` on the sorted header. This is noise.

Over both tests the list came out ahead: +1 item on briefs 12–14 and +3 on briefs 09–11, at about 10% more cost. Both times it fixed the confirmation for a destructive action. It is kept. A regression at default effort is unlikely but has not been measured.

## Next

1. **Keep the hard parts at lower effort.** Low and medium miss the same items, and all of them are in SKILL.md, though some only in the Verify checklist at the end.
   - Test a short "Every screen ships with" list near the top of SKILL.md: states, a confirmation for destructive actions, single-line rows, upload limits.
   - Re-run the three pages at low effort (about $3).
2. **Point CDN pages away from the token files.** In SKILL.md Foundations, say that a single HTML file with the Tailwind CDN does not need `tokens.md` or `tokens.css`. This is a small saving: about 3–9k tokens of context per page.

## Limitations

- 3 briefs, 1 run per side, English prompts only.
- The costs are what `claude -p` reports for this account's model and pricing. Subagents in earlier runs used about 75k (RED) and 105k (GREEN) tokens per page, so the ratio depends on how the agent is run.
