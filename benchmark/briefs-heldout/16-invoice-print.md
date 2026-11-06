---
id: 16-invoice-print
pageType: detail
---
# Invoice view ready to print (billing)

## Prompt (EN)
Create the invoice view for our billing system. It should look right on screen and also print cleanly or save as a PDF to send to the customer.

## Prompt (VI)
Tạo màn hình xem hoá đơn trong hệ thống bán hàng. Trên màn hình phải dễ xem, và in ra hoặc lưu PDF gửi khách cũng phải gọn gàng, chuẩn.

## Acceptance checklist
- [ ] A print stylesheet (`@media print`) hides the app navigation, buttons and toasts, and sets an A4 page size and margins with `@page`
- [ ] The document shows seller and buyer blocks (name, address, tax code), the invoice number, the issue date and the due date
- [ ] Line items show description, quantity, unit price, tax rate and line amount, with numbers right-aligned in tabular figures and the currency stated
- [ ] A totals block shows the subtotal, tax per rate, the total and the amount paid or due, and the totals equal the sum of the lines
- [ ] A long item table breaks across pages without splitting rows, and its header row repeats on each printed page
- [ ] The printed page stays readable in black and white: no meaning carried by colour alone and no light grey text below 4.5:1
- [ ] On screen, the status is a badge with text (Draft, Issued, Paid, Overdue) and the actions (Print, Download PDF, Send) have one primary action
- [ ] Dates and amounts follow one locale throughout, and payment details (bank account, payment reference) are shown
- [ ] The document has a heading structure, and the items table has column headers marked up as header cells
