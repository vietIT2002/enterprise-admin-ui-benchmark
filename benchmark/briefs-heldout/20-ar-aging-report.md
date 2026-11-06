---
id: 20-ar-aging-report
pageType: list
---
# Accounts receivable aging report (accounting)

## Prompt (EN)
Build the accounts receivable aging report for our accounting system: how much each customer still owes, split by how many days overdue it is, with filters and export. Keep it professional.

## Prompt (VI)
Làm báo cáo tuổi nợ phải thu cho hệ thống kế toán: mỗi khách hàng còn nợ bao nhiêu, chia theo số ngày quá hạn, có bộ lọc và xuất file. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Balances are split into Current (not yet due) and past-due buckets of 1–30, 31–60, 61–90 and over 90 days, with no gaps or overlaps between ranges, and the page states whether days are counted from the due date or the invoice date
- [ ] Each customer's row total equals the sum of its buckets, and a grand-total row, set apart from the customer rows, equals the sum of every bucket column and of the total column
- [ ] An as-of date control is present, and the heading or a summary line states the as-of date, the currency, the total receivable and the total overdue (such as "As of 31 Oct 2026 · VND")
- [ ] Money columns are right-aligned with fixed-width digits, thousand separators and one decimal convention, and credit balances such as overpayments carry a leading minus or brackets instead of being signalled by red text alone
- [ ] Users can search by customer name or code, filter by at least one of salesperson, customer group or branch, and restrict the list to customers with overdue balances, with the number of customers shown
- [ ] Each customer row expands, through a keyboard-operable control such as a button with aria-expanded, into its open invoices (invoice number, invoice date, due date, days overdue, open amount), and those amounts add up to the customer's row
- [ ] Clicking a column header re-orders the customers and the header in use carries aria-sort; by default customers are ordered by their over-90 amount (or total balance), largest first
- [ ] An Excel or CSV export is offered, and an @media print style removes navigation, filters and buttons while keeping the as-of date, column headings and grand total on paper
- [ ] Filters that leave no balances show a message saying so instead of an empty grid or a row of zeros, and both a loading state and an error state with a retry action are built in
