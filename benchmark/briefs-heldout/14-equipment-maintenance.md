---
id: 14-equipment-maintenance
pageType: list
---
# Equipment maintenance list (factory)

## Prompt (EN)
I need the equipment list for our factory maintenance system, showing each machine's location, status, last service and next inspection date. Keep it professional.

## Prompt (VI)
Tôi cần trang danh sách thiết bị cho hệ thống bảo trì nhà máy, hiển thị vị trí, trạng thái, lần bảo dưỡng gần nhất và ngày kiểm định tiếp theo của từng máy. Giao diện chuyên nghiệp nhé.

## Acceptance checklist
- [ ] The page header has a plural title and at most one primary action; other actions such as export sit in a secondary position
- [ ] The table appears in the first viewport, with search and 2–3 visible filters (such as location and status) and no row of KPI cards above it
- [ ] By default the list is ordered with overdue inspections first, then inspections due soon, then the rest
- [ ] Overdue and due-soon inspections are marked with a text label (such as "Overdue" or "Due in 7 days"), not by colour alone
- [ ] Dates are absolute and consistently formatted, and every row has a human-readable equipment code
- [ ] Status tabs or a summary line show counts (such as "Overdue 4")
- [ ] Rows are single-line, and row actions show at most two visible controls, with icon-only controls having accessible names
- [ ] A filter combination with no matches shows a no-results state with a clear-filters action, distinct from the first-use empty state; a loading state and an error state with retry are present
- [ ] Interactive targets are at least 24×24px, and text and status contrast meets 4.5:1
