---
id: 28-shift-roster
pageType: list
---
# Weekly shift roster (workforce scheduling)

## Prompt (EN)
Build a weekly shift roster for our store team: staff down the side, the days of the week across the top, and everyone's shifts in the grid so the manager can plan and publish the week. Keep it professional.

## Prompt (VI)
Làm lịch phân ca theo tuần cho nhân viên cửa hàng: danh sách nhân viên theo hàng dọc, các ngày trong tuần theo hàng ngang, và ca làm của từng người trong lưới để quản lý sắp xếp và công bố lịch cả tuần. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The grid header names the week with its date range (such as "Week 45 · 2–8 Nov 2026"), every day column shows the weekday and date, and controls move to the previous, next and current week
- [ ] Each shift shows its start and end time in one consistent 24-hour format and the role or station (such as "07:00–15:00 · Cashier"), and a shift that ends after midnight is marked as ending the next day
- [ ] Each staff row shows the week's scheduled hours against contracted hours (such as "36 / 40 h"), the scheduled figure equals that person's shifts less unpaid breaks, and anyone over or under contract is flagged in words
- [ ] A footer row shows, for each day, the staff count or hours scheduled against the required cover, and days below the requirement are marked in text (such as "Short 1")
- [ ] The sample data contains at least one rule conflict, such as overlapping shifts for one person or less than 11 hours' rest between a closing and the next opening shift, shown on the affected cell with a written reason
- [ ] Approved leave, days off and public holidays appear as labelled cells (such as "Annual leave", "Day off") that look different from an empty, unscheduled cell
- [ ] The week's status (Draft or Published) is shown, and publishing goes through a confirmation that names the week and the number of unresolved conflicts or warnings
- [ ] The grid is a <table> with staff names as row headers and days as column headers, and each shift or empty cell is keyboard-reachable with an accessible name that includes the person and the date (such as "Add shift, Lan Pham, Tue 3 Nov")
- [ ] A week with no shifts yet shows a message with a way to start (such as "Copy last week"), and a loading state and a load error with a retry button exist
