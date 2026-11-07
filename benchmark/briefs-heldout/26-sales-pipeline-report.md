---
id: 26-sales-pipeline-report
pageType: list
---
# Sales pipeline and win-rate report (CRM / sales)

## Prompt (EN)
Build a sales pipeline report for our CRM: open deals by salesperson and by stage, with pipeline value, weighted forecast and win rate for the quarter, plus filters and export. Keep it professional.

## Prompt (VI)
Làm báo cáo pipeline bán hàng cho hệ thống CRM: các cơ hội đang mở theo nhân viên kinh doanh và theo giai đoạn, kèm giá trị pipeline, dự báo có trọng số và tỷ lệ thắng trong quý, có bộ lọc và xuất file. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The stage breakdown lists stages in pipeline order (not alphabetical), each with its win probability, and each stage's weighted value equals its open value × that probability, with the weighted total equal to the sum of the stages
- [ ] Win rate is computed over closed deals only, won ÷ (won + lost), with the counts shown beside it (such as "38% · 19 of 50 closed"), and a salesperson with no closed deals shows "—" instead of 0% or NaN
- [ ] The by-salesperson table ends in a totals row whose deal count, pipeline value and weighted value equal the sum of its rows and match the overall totals of the stage breakdown
- [ ] The period can be set to this quarter, next quarter or a custom range, the page says which date it applies to (expected close date), and the results can also be narrowed to one salesperson or team
- [ ] Every money value shows its currency (one currency for the whole report) with thousands separators and lines up by digit within its column, and any abbreviated headline figure (such as "1.2M") has the full amount available in the table or a title attribute
- [ ] Open deals whose expected close date has already passed are flagged with words (such as "Close date passed"), not colour alone, and the number of such deals is shown per salesperson
- [ ] Each stage and salesperson figure drills down to the deals behind it (deal, account, owner, value, stage, close date) through a link or button that is keyboard-focusable and has a descriptive accessible name
- [ ] When the filters match no deals, the page says so, names the active filters and offers to clear them; a loading indicator and a failed-load message with a retry action are also present
- [ ] Export (CSV or Excel) produces the deal-level rows for the current filters, and its label or confirmation states the scope (such as "Export 42 deals · Q4 2026")
