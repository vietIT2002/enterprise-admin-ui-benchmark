---
id: 09-stock-movements
pageType: list
---
# Stock movements (warehouse inventory)

## Prompt (EN)
I need the stock movements page for our warehouse system, showing receipts, issues, transfers and adjustments across our warehouses. Keep it professional.

## Prompt (VI)
Tôi cần trang lịch sử xuất nhập kho cho hệ thống quản lý kho, hiển thị phiếu nhập, xuất, chuyển kho và điều chỉnh tồn của các kho. Giao diện chuyên nghiệp nhé.

## Acceptance checklist
- [ ] The page header has a plural title ("Stock movements") and at most one primary action; other actions such as export sit in a secondary position
- [ ] The movements table appears in the first viewport, with search and 2–3 visible filters (movement type, warehouse, date range) and no decorative hero above it
- [ ] Movement type is shown as a text label combined with an icon or shape, not by colour alone, and the set of types is limited to receipt, issue, transfer and adjustment
- [ ] Quantity changes carry an explicit + or − sign, are right-aligned with tabular figures, and the unit of measure is in the column header or a separate unit column, not repeated inside cells
- [ ] A transfer row shows both the source and destination warehouse, and each row has a human-readable document number plus an absolute date and time
- [ ] A running balance or resulting on-hand quantity column is available so users can reconcile each movement
- [ ] The table is sorted by date, newest first, by default, with `aria-sort` on the sorted header and pagination at the bottom with a page-size control
- [ ] A filter combination with no matches shows a no-results state with a clear-filters action, distinct from the first-use empty state; a loading skeleton and an error state with retry are also present
- [ ] Icon-only controls have accessible names, interactive targets are at least 24×24px, and text and status contrast meets 4.5:1
