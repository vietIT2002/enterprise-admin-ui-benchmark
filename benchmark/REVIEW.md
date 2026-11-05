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
