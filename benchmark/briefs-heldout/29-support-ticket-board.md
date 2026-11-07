---
id: 29-support-ticket-board
pageType: list
---
# Support ticket board (helpdesk)

## Prompt (EN)
Build the ticket board for our helpdesk: support tickets in columns by status, each card showing the customer, subject, priority, assignee and SLA, so agents can pick up work and move it along. Keep it professional.

## Prompt (VI)
Làm bảng ticket cho hệ thống helpdesk: các ticket hỗ trợ xếp thành cột theo trạng thái, mỗi thẻ hiển thị khách hàng, tiêu đề, mức ưu tiên, người phụ trách và SLA, để nhân viên nhận việc và chuyển trạng thái. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Every status column heading shows the status name and its ticket count, and the count equals the cards shown or the column states how many are not shown (such as "Showing 20 of 134")
- [ ] Each card shows the ticket number (such as #4821), subject, customer, priority as a word or code (such as "P1 · Urgent") and the assignee, or an explicit "Unassigned"
- [ ] Open tickets show the time left to the next SLA target and which target it is (such as "Resolution due in 2h 15m"), and breached tickets show how long they are overdue (such as "Breached 40m ago") in text or with an icon, not by colour alone
- [ ] Tickets in a waiting status (such as "Waiting on customer") show their SLA timer as paused instead of counting down
- [ ] Within each column the cards are ordered by SLA due time or by priority, and the board states which ordering is used
- [ ] Search finds tickets by number, subject or customer, and filters cover assignee (including "Me" and "Unassigned"), priority and SLA state (such as breached or due within 1 hour)
- [ ] Each card has keyboard-reachable actions to assign the ticket (including "Assign to me") and to change its status without dragging, with accessible names that include the ticket number
- [ ] An empty column shows a short message instead of blank space, a search or filter with no matches offers to clear it, and loading and failed-load (with retry) states exist
- [ ] Every relative time (such as "Updated 3h ago") also exposes the exact date, time and timezone, in a <time datetime> element or a title attribute
