# Checklist review protocol

Reviewed runs: run-1 (EN) and run-2 (VI) of every brief, one fresh subagent per run.

## Reviewer prompt — copy verbatim, filling the {{…}} fields

You are reviewing a generated management-system screen against an acceptance checklist. Do not invoke skills and do not edit any file except the one you are asked to write.

Inputs:
- Page source: {{HTML_PATH}}
- Screenshot of the first viewport at 1440×900: {{PNG_PATH}}
- Full-page screenshot: {{FULL_PNG_PATH}}
- Automated audit result: {{AUDIT_PATH}}

For each checklist item decide pass or fail using only evidence in the page (markup, script behaviour, screenshots). An item the page does not implement fails. Quote the evidence briefly (a selector, visible text, or the function that implements it).

Checklist:
{{CHECKLIST}}

Also list every "template tell" you see, using these names where they fit: greeting-header, kpi-icon-tiles, delta-pill-without-period, initials-avatar-non-person, gradient, glass, tracked-uppercase-labels, emoji-icon, rainbow-status, sidebar-promo-card, decorative-chart, card-in-card, hover-lift, oversized-radius, navy-sidebar-indigo-accent.

Write JSON to {{REVIEW_PATH}} in exactly this shape, then reply with only that path:
{"brief":"{{BRIEF_ID}}","run":{{RUN}},"items":[{"item":"<checklist text, verbatim>","pass":true,"evidence":"..."}],"tells":["..."],"notes":"..."}

## Blind review

The open review above shows the run folder in every path, so the reviewer can see which condition built the page.

`npm run bench -- … --blind [--seed N]` reviews blind in one command. It codes the pages, gives each reviewer one code folder in a temp directory whose name says nothing about the condition, and copies the verdicts back. A page with only a blind review gets it as `run-N.review.json`, marked `"blind": true`. The key goes to `benchmark/runs/<name>-<agent>-blind/key.json`.

To review blind by hand:

1. `node benchmark/tools/blind.mjs make <out> <red-folder> <green-folder> --seed <n>` copies every page into `<out>/<code>/` with neutral names: `page.html` (or `src/`), `first.png`, `full.png`, `audit.json` without `url` or `env`. The mapping goes to `<out>/key.json`. Give reviewers only `manifest.json` and the code folders.
2. Use the reviewer prompt above with the code folder's files as inputs. The output is `<out>/<code>/review.json`, and `brief` and `run` can be left as given in the manifest.
3. `node benchmark/tools/blind.mjs unblind <out>` copies each review back as `run-N.review.blind.json` next to the page.
4. `node benchmark/tools/blind.mjs agreement <red-folder> <green-folder>` reports how often the blind and open reviews agree, item by item, and the pass rate of each side under both.
