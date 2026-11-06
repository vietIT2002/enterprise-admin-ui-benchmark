---
id: 21-payslip-print
pageType: detail
---
# Employee payslip (payroll / HRM)

## Prompt (EN)
Build the payslip screen for our payroll system: one employee's pay for one month with earnings, deductions and net pay, which the employee can view and print. Make it look professional.

## Prompt (VI)
Làm màn hình phiếu lương cho hệ thống tính lương: lương một tháng của một nhân viên, gồm các khoản thu nhập, các khoản khấu trừ và số tiền thực lĩnh, để nhân viên xem và in ra. Trình bày chuyên nghiệp.

## Acceptance checklist
- [ ] The slip identifies the employer (company name and tax code or address), the employee (full name, employee ID, department, job title) and the pay period together with its payment date
- [ ] Earnings are itemised — basic salary with its proration (such as "21 / 22 working days"), each allowance, and overtime as hours × rate — and Gross pay equals the sum of the earnings lines
- [ ] Deductions show the employee's social, health and unemployment insurance (each with its rate and contribution base) and personal income tax (with the taxable income it was computed on) apart from other deductions such as salary advances, and Total deductions equals their sum
- [ ] Net pay equals Gross pay minus Total deductions to the last unit and is the most prominent figure on the slip
- [ ] Amounts line up on the right with fixed-width digits and thousand separators, the currency is named, and decimals suit the currency (none for VND, two for USD) throughout
- [ ] Earnings and deductions are marked up as tables with header cells or as dt/dd label–value pairs, so a screen reader announces each amount together with its label
- [ ] A Print button is present, and the print stylesheet hides the app's sidebar, top bar and buttons, sets an A4 page with @page and keeps the earnings and deductions blocks from splitting across pages
- [ ] The bank account number is masked except for its last four digits, and the slip carries a "Confidential" marking that also appears when printed
- [ ] A period selector switches between months and the heading names the month shown; a month without a payslip shows a message saying so rather than zeros, and loading and error-with-retry states are built in
