# COMPARE: five setups on the same twelve independent admin screens, reviewed blind

Which setup builds better management screens:
- this skill;
- three popular design skills;
- no skill at all?

Each built the same 12 briefs. The acceptance checklists were written by an agent that never read any of these skills (HELDOUT3 and HELDOUT4). Every page was reviewed blind against its checklist.

## Setup

| | |
|---|---|
| Briefs | HELDOUT3 `20`–`25` and HELDOUT4 `26`–`31`, English prompt, one page per setup per brief. 9 checklist items each, 108 per setup |
| Setups | **No skill** and **enterprise-admin-ui v0.5.8**, from the HELDOUT3/HELDOUT4 runs.<br>**frontend-design** (`anthropics/skills`, commit 2c5958e), **ui-ux-pro-max** (`nextlevelbuilder/ui-ux-pro-max-skill` `.claude/skills/ui-ux-pro-max`, b7d5353) and **impeccable** (`pbakaus/impeccable` `.claude/skills/impeccable`, 687bc38), each run with `bench.mjs --skill-dir` |
| Generation | Claude Sonnet 5.5 at default effort, single HTML file with the Tailwind CDN. Every skill got the same prompt ("A skill for this kind of work is installed at … read its SKILL.md and follow it") and the same tools: read, write and edit files; no shell |
| Review | One fresh reviewer per page, who saw only a randomly coded page, its screenshots and the audit (`blind-review.mjs`). The three new skills were reviewed in one pool (seed 20261111); the other two setups come from the HELDOUT3/4 pools, with the same prompt and protocol |
| Excluded | **taste-skill**: its own scope excludes dashboards and data tables |

## Results

| Setup | Checklist | UI behaviour (65) | Domain content (43) | Median audit | Template tells |
|---|---|---|---|---|---|
| **enterprise-admin-ui v0.5.8** | **47/108 (44%)** | **33 (51%)** | 14 (33%) | 90 | 4 on 3 pages |
| ui-ux-pro-max | 32/108 (30%) | 19 (29%) | 13 (30%) | 64 | 50 on 12 pages |
| impeccable | 21/108 (19%) | 12 (18%) | 9 (21%) | 67 | 31 on 12 pages |
| No skill | 20/108 (19%) | 9 (14%) | 11 (26%) | 69 | 37 on 11 pages |
| frontend-design | 19/108 (18%) | 9 (14%) | 10 (23%) | 76 | 5 on 4 pages |

| Brief | No skill | enterprise-admin-ui | frontend-design | ui-ux-pro-max | impeccable |
|---|---|---|---|---|---|
| 20 Accounts receivable aging | 1 | 4 | 4 | 3 | 3 |
| 21 Payslip | 3 | 4 | 4 | 5 | 3 |
| 22 Room booking calendar | 3 | 6 | 2 | 4 | 3 |
| 23 Recruitment pipeline | 2 | 6 | 3 | 3 | 1 |
| 24 Organisation structure | 0 | 2 | 0 | 1 | 1 |
| 25 Audit log | 3 | 4 | 2 | 3 | 3 |
| 26 Sales pipeline report | 0 | 5 | 0 | 1 | 2 |
| 27 Delivery note | 2 | 3 | 1 | 1 | 1 |
| 28 Shift roster | 1 | 1 | 0 | 2 | 0 |
| 29 Support ticket board | 2 | 2 | 2 | 2 | 1 |
| 30 Product category tree | 2 | 6 | 1 | 4 | 2 |
| 31 User access admin | 1 | 4 | 0 | 3 | 1 |

Paired by brief, enterprise-admin-ui is ahead of:
- ui-ux-pro-max by 1.25 items a brief (t ≈ 2.9, 11 df);
- frontend-design by 2.3 items a brief.

UI behaviour and domain content follow the split used in HELDOUT3 and HELDOUT4.

## Reading

- **On management screens, the specialised skill wins clearly.** It roughly doubles the checklist of the other setups. The gap is largest on UI behaviour (51% against 14–29%), which is what the skill teaches.
- **General design skills did not help on these screens.** frontend-design and impeccable scored the same as no skill (18–19%). frontend-design produced few template tells: its pages look distinctive. But the checklists ask for states, filters, totals, confirmations and print, which it does not address.
- **ui-ux-pro-max helped somewhat** (30%), even without its search script. Its UX rules seem to raise the behaviour items.
- **Domain content is low for every setup** (21–33%). No skill supplies business rules that the prompt leaves out.

## Caveats

- **Home ground.** These are management screens, the domain this skill is built for. The other skills target design and UI in general, so this is not a verdict on what they are made for.
- **Scripts did not run.** No skill could run its scripts, so ui-ux-pro-max ran without its search script and impeccable without its detector and commands. Each worked from its instructions and files only, as the same rule applied to this skill. Allowing a shell would mean running third-party code.
- **Our own measures.** The audit score and the list of template tells are this project's own. The acceptance checklists are not: an independent agent wrote them.
- **Sample.** One page per setup per brief. A single page varies by about 3 items between runs, so differences of a few points between setups are not reliable. The 25-point gap is.
- **Separate pools.** The no-skill and v0.5.8 pages were built and reviewed on 2026-11-06, the others on 2026-11-07 to 2026-11-09. All were single-page blind reviews with the same prompt.
- **Incidents.**
  - The ui-ux-pro-max run was interrupted; its two missing pages (briefs 30 and 31) were built again on 2026-11-09 with the same skill commit.
  - One reviewer's JSON had unescaped quotes in an evidence string, which were escaped by hand; no verdict changed.
  - The per-review cost of this pool was not saved (see `NOTE.md`).

## Cost

| Item | Cost |
|---|---|
| frontend-design, 12 pages | $10.71 (median $0.90) |
| impeccable, 12 pages | $16.35 (median $1.50) |
| ui-ux-pro-max | 2 rebuilt pages $4.50. The interrupted run's 10 pages were not recorded (about $20 at the same rate) |
| Blind reviews, 36 | not recorded (about $17 at earlier rates) |
| **Total** | **$31.56 recorded, about $68 with the estimates** |

## Files

- `2026-11-07-compare-frontend-design-claude-green/`, `2026-11-07-compare-ui-ux-pro-max-claude-green/`, `2026-11-07-compare-impeccable-claude-green/`: pages, audits and blind reviews.
- This folder: key, manifest and notes.
- No skill and v0.5.8 pages: [HELDOUT3](../2026-11-06-heldout3-claude-green/HELDOUT3.md), [HELDOUT4](../2026-11-06-heldout4-new-claude-green/HELDOUT4.md).
