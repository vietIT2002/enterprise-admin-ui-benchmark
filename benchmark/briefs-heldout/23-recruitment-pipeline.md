---
id: 23-recruitment-pipeline
pageType: list
---
# Recruitment pipeline board (HRM)

## Prompt (EN)
Build the recruitment pipeline for our HR system: a board showing the candidates for a job opening as they move through the hiring stages, from application to hire, with search and filters. Keep it professional.

## Prompt (VI)
Làm màn hình quy trình tuyển dụng cho hệ thống nhân sự: một bảng thể hiện các ứng viên của một vị trí đang tuyển đi qua các vòng tuyển dụng, từ nộp hồ sơ đến nhận việc, có tìm kiếm và bộ lọc. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Stage columns run in hiring order (such as Applied → Screening → Interview → Offer → Hired), and rejected or withdrawn candidates are kept out of the active columns, in a separate collapsed column or behind a filter
- [ ] Each stage header shows a candidate count that matches the number of cards in that column under the current filters
- [ ] The page names the opening being shown (job title, department, positions to fill and hired so far, such as "Senior Accountant · Finance · 1 of 2 hired"), and a selector switches to another opening
- [ ] Each card gives the candidate's name, application source and days in the current stage, and candidates who have stayed past a stated limit are flagged with a text label or icon rather than colour alone
- [ ] A card can change stage without dragging, through a "Move to" menu or buttons that work from the keyboard, and each move is announced through an aria-live region
- [ ] Moving a candidate to Rejected opens a confirmation that names the candidate and requires a rejection reason before it completes
- [ ] Search by candidate name or email and filters by source and by recruiter narrow the board, and the active filters are displayed with a way to clear them
- [ ] Opening a card shows the candidate's contact details, a link to the CV and a stage history listing each move with its date and the person who made it
- [ ] A stage with no candidates keeps its column and shows a placeholder such as "No candidates", and loading and error-with-retry states are built in
