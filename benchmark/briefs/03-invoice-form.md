---
id: 03-invoice-form
pageType: form
---
# Create invoice with line items (accounting)

## Prompt (EN)
Build the create invoice form for an accounting system: customer, invoice and due dates, line items (product, quantity, unit price, tax, amount), totals, and save. Professional look.

## Prompt (VI)
Làm form tạo hóa đơn cho phần mềm kế toán: khách hàng, ngày hóa đơn và hạn thanh toán, các dòng hàng (sản phẩm, số lượng, đơn giá, thuế, thành tiền), tổng cộng và nút lưu. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Every field has a visible label above it; no placeholder is used as the label
- [ ] Field widths match the expected input (dates and quantities are narrow)
- [ ] Required fields are marked with an asterisk
- [ ] Line items can be added and removed; quantities, prices and amounts are right-aligned with tabular figures
- [ ] Subtotal, tax and total are computed and right-aligned with locale currency formatting
- [ ] Fields validate on blur and on submit; with three or more errors a summary appears and focus moves to the first error
- [ ] Save is not disabled before submitting; it is disabled only while the submission is in progress
- [ ] Save and Cancel stay reachable in a sticky bar, and leaving with unsaved changes asks for confirmation
