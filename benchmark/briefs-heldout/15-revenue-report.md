---
id: 15-revenue-report
pageType: list
---
# Monthly revenue report (accounting)

## Prompt (EN)
Build the monthly revenue report for our accounting system: revenue by customer and by product, compared with last month and last year, with filters and export. Professional look.

## Prompt (VI)
Làm báo cáo doanh thu theo tháng cho hệ thống kế toán: doanh thu theo khách hàng và theo sản phẩm, so sánh với tháng trước và cùng kỳ năm trước, có bộ lọc và xuất file. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Filters include the period, with presets (this month, last month, custom range), and at least one dimension; the applied period is stated in the title or a summary line (such as "Revenue · October 2026")
- [ ] Amounts are right-aligned in tabular figures, formatted as currency with consistent decimals, and negative values use a minus sign or parentheses rather than colour alone
- [ ] Every comparison names its base and period (such as "+12.4% vs Sep 2026"), and a missing base shows "—" rather than Infinity, NaN or 100%
- [ ] A totals row equals the sum of the rows, with subtotals when rows are grouped, and stays visibly separate from the data rows
- [ ] Columns are sortable with the active sort shown (aria-sort), and the default order is meaningful, such as revenue from high to low
- [ ] Export downloads the current filtered view, and printing gives a clean report without the sidebar, buttons or filters
- [ ] The page states when the data was last updated and the currency (and tax basis, if any) of the figures
- [ ] A period with no data shows an empty state; loading and an error with retry are present
- [ ] Any chart has a text or table equivalent, and no pie or donut chart is used for more than five categories
