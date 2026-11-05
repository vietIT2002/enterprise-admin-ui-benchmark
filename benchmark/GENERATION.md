# Generation protocol (tier 1)

One run = one fresh subagent producing one self-contained HTML page for one brief.

## Folder layout

- `benchmark/runs/<YYYY-MM-DD>-<condition>/<brief-id>/run-<n>.html`, n = 1..5.
- Odd n uses the brief's "Prompt (EN)"; even n uses "Prompt (VI)".
- One round = the 8 briefs for the same n, dispatched in parallel. Run the rounds one after another.
- Record the model the subagents used in the condition's report.

## RED prompt (no skill) — copy verbatim, filling {{PROMPT}} and {{OUT_PATH}}

Do NOT invoke any skills (no Skill tool calls) and do not read any files under `skills/`, `docs/` or `benchmark/` — just do the task directly as you normally would.

Task from a user: "{{PROMPT}}"

Constraints: deliver a single self-contained HTML file using Tailwind via CDN (`<script src="https://cdn.tailwindcss.com"></script>`) plus vanilla JS with realistic mock data. Do not open a browser, start a server or run tests — write the file once and stop. Write it to:
{{OUT_PATH}}

When done, reply with only the file path.

## GREEN prompt (skill installed) — copy verbatim, filling {{PROMPT}} and {{OUT_PATH}}

A skill for this kind of work is installed at <repo>\skills\enterprise-admin-ui. Before you start, read its SKILL.md and follow it; open the reference files it points to when your task needs them. Do not read any other files under `skills/`, `docs/` or `benchmark/`, and do not create any file other than the one below.

Task from a user: "{{PROMPT}}"

Constraints: deliver a single self-contained HTML file using Tailwind via CDN (`<script src="https://cdn.tailwindcss.com"></script>`) plus vanilla JS with realistic mock data. Do not open a browser, start a server or run tests — write the file once and stop. Write it to:
{{OUT_PATH}}

When done, reply with only the file path.

## Next.js variant (NEXT run)

The same RED or GREEN first paragraph, then the text below in place of the task and constraints. `{{APP}}` is the app copy for the condition, `{{ROUTE}}` the route (`/contracts/[id]`, `/employees/new`, `/equipment`) and `{{DIR}}` its folder under `app/`. For the contract page, the constraints add "; it will be opened at `/contracts/HD-2026-0187`".

You are working in an existing Next.js 16 app (App Router, TypeScript, Tailwind CSS v4, shadcn/ui components in `components/ui`) at:
{{APP}}

Task from a user: "{{PROMPT}}"

Constraints: build it as the route `{{ROUTE}}` (file `app/{{DIR}}/page.tsx`) with realistic mock data. Put every file you create inside `app/{{DIR}}/` (for example `_components/` or `_lib/`); do not edit files outside that folder, do not install packages and do not run the shadcn CLI. Use the components in `components/ui` where they fit. Other agents are building other routes in this app at the same time; ignore their folders. Do not open a browser, start a server, build or run tests — write the files and stop.

When done, reply with only the list of files you created.
