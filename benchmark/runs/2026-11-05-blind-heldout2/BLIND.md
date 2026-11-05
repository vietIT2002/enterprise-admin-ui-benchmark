# BLIND — do the reviewers favour the skill?

Every checklist review so far was open: the paths contained `red` or `green`, so the reviewer knew which condition built the page. This pilot re-reviews the 12 held-out 2 pages blind and compares the two verdicts.

## Setup

| | |
|---|---|
| Pages | All 12 held-out 2 pages: briefs 12, 13 and 14, runs 1–2, without and with the skill |
| Blinding | [`blind.mjs`](../../tools/blind.mjs) `make --seed 20261105` copied each page to a random code folder (`P0QPU`, `PS9EF`, …) as `page.html`, `first.png`, `full.png` and `audit.json`, with `url` and `env` removed. No page source mentions the skill |
| Reviewers | Claude Sonnet 5.5, one fresh agent per page, told to read only the four files. Same checklist and wording as the open review ([REVIEW.md](../../REVIEW.md), Blind review) |
| Key | `key.json` maps each code to its page; `manifest.json` lists what the reviewers saw. The blind verdicts are stored as `run-N.review.blind.json` next to each page |

## Results

| | Open review | Blind review |
|---|---|---|
| Without the skill | 21/54 (39%) | 22/54 (41%) |
| With the skill | 48/54 (89%) | 48/54 (89%) |
| Template tells | 11 / 1 | 9 / 0 |

The blind and open verdicts agree on **105 of 108 items (97%)**. The three disagreements are judgment calls, one in each direction:
- **RED 14 run 2, #4.** Open: due-soon rows differ from later rows only by colour. Blind: every row carries "còn N ngày", so it passes.
- **GREEN 12 run 2, #8.** Open: the History tab's empty state has no action. Blind: passed.
- **GREEN 13 run 2, #3.** Open: the widths fit their content. Blind: dates and the tax code are as wide as the name fields.

The gap between the conditions is the same blind (41% → 89%) as open (39% → 89%). Knowing the condition did not inflate the skill's results.

## Limitations

- One brief set, 12 pages, one blind reviewer per page.
- The reviewers come from the same model family as the generator. Blinding removes knowledge of the condition, not model bias.
- Blinding does not hide the visual style, and a page that looks well designed may still get the benefit of the doubt.
