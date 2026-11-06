---
id: 25-audit-log
pageType: list
---
# Audit log (back-office administration)

## Prompt (EN)
Build the audit log screen for our admin back office: a history of who changed what and when across the system, with search and filters so an administrator can investigate a change. Keep it professional.

## Prompt (VI)
Làm màn hình nhật ký hoạt động (audit log) cho trang quản trị: lịch sử ai đã thay đổi gì và vào lúc nào trên toàn hệ thống, có tìm kiếm và bộ lọc để quản trị viên truy vết một thay đổi. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Each entry shows when, who (the person's name and account, or "System" or the integration's name for automated changes), the action, the affected record (type plus ID or name) and the outcome (such as Success, Failed or Denied) in text
- [ ] Timestamps give the date and the time to the second with the time zone stated (such as "05/11/2026 14:32:07 UTC+7"), and entries are listed newest first
- [ ] An update entry shows each changed field with its old and new value side by side under "Before" and "After" labels, so the change reads correctly without relying on colour
- [ ] Passwords, tokens and other secret fields never appear in clear text; their changes are shown masked (such as "•••••• changed")
- [ ] Filters cover a date range with presets, the actor, the action type and the record type, a search box finds a record by its ID, and the number of matching entries is shown
- [ ] Entries are read-only: no edit or delete control appears on any entry, and the page states that the log cannot be altered
- [ ] Export to CSV or Excel covers exactly the entries matching the current filters, and the export control states how many entries it will include
- [ ] The log is a table with column header cells, and each entry's details open from a keyboard-operable control (a button with aria-expanded or a link) rather than only from a click on the row
- [ ] Filters that match nothing show a message with a clear-filters action, and a loading state and an error state with retry are built in
