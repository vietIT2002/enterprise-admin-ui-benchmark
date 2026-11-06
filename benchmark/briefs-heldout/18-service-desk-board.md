---
id: 18-service-desk-board
pageType: list
---
# IT service desk board (Kanban)

## Prompt (EN)
I need a board for our IT service desk tickets: columns by status, cards with priority, assignee and due date, and an easy way to move tickets along. Professional look.

## Prompt (VI)
Tôi cần bảng Kanban cho phiếu hỗ trợ IT: các cột theo trạng thái, thẻ có mức ưu tiên, người xử lý và hạn xử lý, chuyển phiếu giữa các cột dễ dàng. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Columns by status show a count in their header (such as "In progress 5"), and a work-in-progress limit is shown where one applies
- [ ] Cards show the ticket code, a title (truncated with the full text available), the priority as a text label, the assignee's name and the due date or age
- [ ] A card can be moved without dragging (a "Move to" menu or the keyboard), and a drag-and-drop move is announced to assistive technology
- [ ] Moving to a status that needs input (such as Resolved needing a resolution note) asks for it, and a move can be undone (a toast with Undo)
- [ ] Filters for assignee and priority, a search, and a switch to a list or table view
- [ ] Overdue or ageing tickets are marked with a text label, not by colour alone
- [ ] Columns scroll on their own with sticky headers, and a wide board scrolls sideways without the page header scrolling away
- [ ] An empty column shows a short empty state, and loading and an error with retry are present
- [ ] Opening a card shows its details in a side panel without losing the board's position or filters
