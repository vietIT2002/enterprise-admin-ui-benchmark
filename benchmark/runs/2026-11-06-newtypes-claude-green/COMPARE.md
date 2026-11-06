# RED vs GREEN — 2026-11-06-newtypes-claude-red → 2026-11-06-newtypes-claude-green

## Setup

| Side | Runs | Errors | Reviews |
|---|---|---|---|
| RED | 5 | 0 | 5 |
| GREEN | 4 | 0 | 4 |

## Targets (spec §12)

| Target | GREEN | Met |
|---|---|---|
| Median violated rules reduced ≥70% | 75% | ✓ |
| ≥80% of runs clean on hard metrics | 50% | ✗ |
| Checklist pass rate ≥90% | 50% | ✗ |

## Metrics

| Metric / rule | RED | GREEN | Δ |
|---|---|---|---|
| Median score | 72 | 90 | +18 |
| Median violated rules | 4 | 1 | -3 |
| Runs clean on hard metrics | 0% | 50% | +50 |
| Checklist pass rate | 33% | 50% | +17 |
| font-size-base | 20% (1/5) | 50% (2/4) | +30 |
| type-scale | 20% (1/5) | 0% (0/4) | -20 |
| radius-scale | 100% (5/5) | 0% (0/4) | -100 |
| table-row-height | 0% (0/3) | 0% (0/3) | 0 |
| table-row-two-line | 33% (1/3) | 33% (1/3) | 0 |
| numeric-align | 33% (1/3) | 0% (0/3) | -33 |
| tabular-nums | 33% (1/3) | 0% (0/3) | -33 |
| table-above-fold | 0% (0/2) | 0% (0/2) | 0 |
| icon-button-name | 20% (1/5) | 0% (0/4) | -20 |
| target-size | 0% (0/5) | 0% (0/4) | 0 |
| text-contrast | 100% (5/5) | 50% (2/4) | -50 |
| no-gradient | 0% (0/5) | 0% (0/4) | 0 |
| no-backdrop-blur | 0% (0/5) | 0% (0/4) | 0 |
| surface-shadow | 80% (4/5) | 0% (0/4) | -80 |
| uppercase-text | 80% (4/5) | 0% (0/4) | -80 |
| emoji-icon | 0% (0/5) | 0% (0/4) | 0 |
| single-primary-action | 0% (0/2) | 0% (0/4) | 0 |
| hidden-overridden | n/a | 0% (0/4) | — |
| sticky-inert | 0% (0/2) | 0% (0/1) | 0 |
| label-beside-field | n/a | n/a | — |
| input-type | n/a | n/a | — |
| contact-link | 100% (1/1) | 0% (0/1) | -100 |

## Checklist pass rate per brief

| Brief | RED | GREEN | Δ |
|---|---|---|---|
| 16-invoice-print | 44% | 89% | +45 |
| 17-leave-calendar | 22% | 11% | -11 |
| 18-service-desk-board | 33% | 44% | +11 |
| 19-chart-of-accounts | 22% | 56% | +34 |
