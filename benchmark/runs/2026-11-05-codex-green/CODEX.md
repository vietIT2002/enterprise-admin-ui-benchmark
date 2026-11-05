# CODEX — the skill with a second agent

Earlier runs used one model family to build every page. This run asks whether the skill also helps an agent from another vendor.

## Setup

| | |
|---|---|
| Agent | Codex CLI 0.166.0, model `gpt-6.1-sol`, reasoning effort `medium`, signed in with a ChatGPT account |
| Isolation | `--ignore-user-config`, so no plugins, MCP servers or global AGENTS.md (`windows.sandbox="unelevated"` was passed back in). Each run had an empty working folder, `--ephemeral`, and a `workspace-write` sandbox |
| Prompts | The [GENERATION.md](../../GENERATION.md) RED and GREEN prompts, word for word ([`codex-run.mjs`](../../tools/codex-run.mjs), checked by `tests/codex-run.test.mjs`) |
| Briefs | The three held-out briefs 12, 13 and 14, English prompt, 1 run each |
| Scoring | `audit.js` 0.4.0 and the same checklist review as the HTML runs, by Claude Sonnet 5.5 reviewers |

Per-run time and tokens are in `codex-runs.json`. None of the RED runs opened a skill file. The GREEN runs read `SKILL.md`. The onboarding run also opened `forms.md`, `accessibility.md`, `feedback-states.md` and `navigation-layout.md`, and the equipment run `forms.md` and `navigation-layout.md`.

## Results

| Metric | Without skill | With skill |
|---|---|---|
| Checklist pass rate | 9/27 (33%) | **26/27 (96%)** |
| Items for the 0.5.2 rules (12#3, 12#4, 13#4, 14#3) | 2/4 | **4/4** |
| Median audit score | 62 (36, 66, 62) | **100** (100, 100, 90) |
| Pages clean on hard metrics | 0/3 | **3/3** |
| Dominant font size | 11–12px | **14px** |
| Muted text below 4.5:1 | 3/3 pages | **0/3** |
| ALL-CAPS labels | 2/3 pages | **0/3** |
| Template tells seen by reviewers | 10: KPI icon tiles, navy sidebar with indigo accent, sidebar promo card, greeting header, tracked caps ×3, emoji icons ×2, oversized radius | **1**: a ↗ glyph used as a row-action icon |
| Time per page | 3–5.5 min | 8–13 min |
| Output tokens per page | 8–15k | 21–35k |

Without the skill, Codex built the familiar template: a navy sidebar with an indigo accent, KPI tiles above the list, a greeting, ALL-CAPS labels and small grey text. With the skill, its pages passed 26 of 27 items.

The remaining failure was 12#9: the contract page has no Terminate action at all, so it has no confirmation dialog either. The GREEN run took about 2.5 times as long and used 2–3 times as many output tokens, mostly from reading the skill and its references.

## Limitations

- One run per brief per side (6 pages), English prompts only.
- The reviewers were Claude models and not blind to the condition.
- `--ignore-user-config` is not how most people run Codex. With their plugins and global AGENTS.md loaded, results may differ.
- This run did not measure whether the skill loads in Codex on its own, without the prompt naming it.
