# Trigger rate — does Claude Code load the skill on its own?

Spec §12 asks two questions. Does the skill load when someone asks for a management screen without naming it? Does it stay out of landing pages and marketing sites?

## Setup

| | |
|---|---|
| Date | 2026-11-05 |
| Agent | Claude Code 2.1.201, `claude -p`, model `sonnet` (Claude Sonnet 5.5) |
| Skill | enterprise-admin-ui v0.5.1, copied into the test project's `.claude/skills/` |
| Isolation | `--setting-sources project --strict-mcp-config`: no user plugins, hooks or MCP servers (init event: `plugins: []`, `mcp_servers: []`). Claude Code's built-in skills stay on (`artifact-design`, `dataviz`, `deep-research`…), as every user has them |
| Prompts | [`benchmark/trigger/prompts.json`](../../trigger/prompts.json): 20 management screens (10 EN, 10 VI) and 10 landing, marketing or portfolio pages (5 EN, 5 VI). None names the skill |
| Configs | `skill`: the skill only. `snippet`: the skill plus [`adapters/AGENTS.snippet.md`](../../../adapters/AGENTS.snippet.md) as the project's `CLAUDE.md` |
| Runs | 30 prompts × 2 configs × 1 run = 60, all valid (every transcript has an init and a result event) |
| Limits | `--max-turns 2`, with Write, Edit, Bash, NotebookEdit, WebFetch and WebSearch disallowed, so nothing is built; only the first tool calls are observed |
| Detection | A `Skill` tool call naming `enterprise-admin-ui`, or a `Read` of its `SKILL.md` ([`trigger-run.mjs`](../../tools/trigger-run.mjs), with tests in `tests/trigger.test.mjs`) |
| Cost | $7.34 (reported by the CLI) |

## Results

| Config | Management prompts that loaded the skill | Landing prompts that loaded it (false triggers) |
|---|---|---|
| `skill` (no snippet) | **20/20 (100%)** | **0/10 (0%)** |
| `snippet` | **20/20 (100%)** | **0/10 (0%)** |
| Spec target | ≥80% without snippet, ≥95% with it | ≤10% |

- **Without the snippet,** every management prompt loaded the skill through the `Skill` tool. In 19 of 20 runs it was the first tool call; in the other run, the first call was a `Read` of the empty project, and the skill loaded next.
- **With the snippet,** every management prompt also loaded the skill. In 5 of 10 English runs the agent first listed the project (`Glob`), then loaded the skill.
- **On landing pages,** the agent never loaded this skill. In 18 of 20 runs it loaded Claude Code's own `artifact-design` skill instead. In one run it read the project first, and in one it asked the user clarifying questions.
- **Language** made no difference: Vietnamese and English prompts triggered alike.

## Limitations

- **One agent and one model.** This is Claude Code with Sonnet 5.5. Opus, Codex, Cursor, Copilot and Antigravity were not measured.
- **One run per prompt,** and we wrote the prompts. The management prompts are explicit about the domain (ERP, CRM, HRM, admin). Vaguer requests ("make a table of my data") were not tested.
- **Empty test project.** In a real codebase, other project skills or CLAUDE.md rules may compete with the skill.
