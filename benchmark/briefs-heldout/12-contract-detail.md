---
id: 12-contract-detail
pageType: detail
---
# Vendor contract detail (procurement)

## Prompt (EN)
Create the contract detail page for our procurement system: contract terms, the vendor's contacts, payment milestones, amendments and renewal. Professional look.

## Prompt (VI)
Tạo trang chi tiết hợp đồng cho hệ thống mua hàng: điều khoản hợp đồng, người liên hệ của nhà cung cấp, các mốc thanh toán, phụ lục và gia hạn. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] A breadcrumb leads back to the contracts list and ends with the contract number, and the header shows the contract number, vendor name, a status badge with text, and at most four key fields (such as value, start and end date)
- [ ] The header has one primary action (such as "Renew contract") and puts other actions such as edit or terminate in a secondary or overflow position
- [ ] Vendor contacts show each person's name and role, with email as a `mailto:` link and phone as a `tel:` link, and the primary contact is marked with text
- [ ] Payment milestones show the due date, amount and status, with amounts right-aligned in tabular figures and formatted as currency, and the milestones are ordered with overdue and due-soon ones first
- [ ] Overdue or upcoming milestones are marked with a text label (such as "Overdue" or "Due in 5 days"), not by colour alone
- [ ] The renewal or expiry date is shown as an absolute date with the remaining time stated in words (such as "Expires in 45 days")
- [ ] Amendments are listed with number, date, a short summary and who approved them, using absolute dates
- [ ] Each section has an empty state with a next action (such as "Add contact" or "Add amendment"), a loading state, and an inline error with retry
- [ ] Terminating the contract asks for confirmation that names the contract and the consequence, with a verb button label and focus not on the destructive button
