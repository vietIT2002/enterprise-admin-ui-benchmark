# NEXT — the skill in a real Next.js + shadcn/ui codebase

Until now every page was a single HTML file. This run asks whether the skill still helps inside a real codebase.

## Setup

| | |
|---|---|
| App | `create-next-app` 16.4.5 with its defaults (App Router, TypeScript, Tailwind 4, `cacheComponents` on), React 19.3, shadcn/ui with 29 components preinstalled, plus a `TooltipProvider` and `Toaster` in the root layout |
| Conditions | Two copies of the same app. RED got the [GENERATION.md](../../GENERATION.md) RED prompt, and GREEN the GREEN prompt (read `SKILL.md`) |
| Briefs | The three held-out briefs 12, 13 and 14, English prompt, 1 run each |
| Generator | Claude Sonnet 5.5, a fresh subagent per page |
| Rules for the agent | Build the route (`/contracts/[id]`, `/employees/new`, `/equipment`) with mock data. Write only inside the route folder, use `components/ui`, install nothing, and do not build or run anything |
| Scoring | `tsc --noEmit`, `eslint`, `next build` per route (the other routes moved out), `audit.js` 0.4.0 on the page served by `next dev`, and the checklist review from the route source and screenshots |

The route source is in `run-1.src/` next to each page's audit and review. The build results are in `build.json`.

## Results

| Metric | Without skill | With skill |
|---|---|---|
| Checklist pass rate | 12/27 (44%) | **25/27 (93%)** |
| Items for the 0.5.2 rules (12#3, 12#4, 13#4, 14#3) | 2/4 | **4/4** |
| Median audit score | 76 (66, 80, 76) | **90** (90, 90, 90) |
| `tsc` and `eslint` | pass | pass |
| `next build` per route | 2/3 | **1/3** |
| Template tells seen by reviewers | card-in-card ×2, glass, oversized-radius ×2, a 4-up fact strip | card-in-card ×1 |

The audit found muted text below 4.5:1 on 2/3 RED pages and 0/3 GREEN pages. Stacked two-line table rows appeared on 2/2 RED tables and 0/3 GREEN tables. Small targets were found on 1/2 RED pages and 0/3 GREEN pages.

The checklist gap (44% → 93%) is close to the HTML held-out result (39% → 89%). So the skill's recipes carry over to a React/shadcn codebase.

## What the run found

**`next build` failed on more pages with the skill.** New Next 16 apps turn on `cacheComponents`. With it on, a page that reads `params` or `searchParams` outside `<Suspense>` fails `next build`, while `tsc`, `eslint` and `next dev` all pass.
- Both contract pages read `params` that way (1 RED, 1 GREEN).
- The GREEN onboarding page also awaited `searchParams` to read `?state=`, the skill's mock-data convention. The GREEN equipment page read it with `useSearchParams` inside `<Suspense>` and built.
- **Fix:** SKILL.md (Mock data) and `react-shadcn.md` (Setup) now say to read route data in a client component under `<Suspense>` and to run `next build` before calling the page done. This was not re-measured.

**Every page fails `radius-scale`, on both sides.** The template's shadcn radius is 10px (`--radius: 0.625rem`). The skill's setup replaces those tokens with `assets/tokens.css`, but this run did not let agents edit files outside their route. Both sides lose the same 10 points, so the audit medians understate both. In a project where the agent may edit `globals.css`, the skill's setup step would apply.

**Remaining GREEN checklist failures:**
- **13#8.** The upload states the file types but not the size limit, and Remove sits in a "…" menu instead of a visible button.
- **14#1.** The title "Equipment" was judged not plural. It is an uncountable noun, so this call is debatable.

## Limitations

- One run per brief per side (6 pages), English prompts only, one reviewer per page, not blind.
- The agents could not edit shared files or run the build, so neither side could fix the theme or the build errors as they would in a normal session.
