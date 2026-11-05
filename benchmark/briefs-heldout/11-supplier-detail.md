---
id: 11-supplier-detail
pageType: detail
---
# Supplier detail (purchasing)

## Prompt (EN)
Create the supplier detail page for our purchasing system, with company info, contacts, purchase orders, documents and certificates, and performance. It should look professional.

## Prompt (VI)
Tạo trang chi tiết nhà cung cấp cho hệ thống mua hàng, gồm thông tin công ty, người liên hệ, đơn mua hàng, tài liệu và chứng chỉ, và hiệu suất giao hàng. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The page has breadcrumbs back to the suppliers list, and the header shows the supplier name untruncated, a supplier code, a status lozenge with a text label, and up to four key fields
- [ ] The header has one primary action (such as "Create purchase order") with other actions such as edit or deactivate in a secondary or overflow position
- [ ] Sections (overview, contacts, purchase orders, documents, performance) are reachable through tabs or an anchor bar, with the first section loaded by default and the active one marked for assistive technology
- [ ] Company details are shown as label–value pairs in a read-only layout, with empty values handled consistently and never shown as "N/A", and email and phone shown as links with the primary contact marked
- [ ] The purchase orders list shows PO number, absolute date, status and a right-aligned total with currency, uses tabular figures, and links each PO number to its record
- [ ] Each certificate or document shows its expiry date and a status that combines colour with a text label ("Valid", "Expiring in 30 days", "Expired"), and expired or expiring items are visually surfaced first
- [ ] Performance metrics (such as on-time delivery rate and quality or defect rate) state their measurement period and unit, and show a signed change against the previous period without relying on colour alone
- [ ] Each section has its own empty state with a useful next action (for example "Add contact", "Upload certificate") and a loading skeleton; a failed section shows an inline error with retry
- [ ] Deactivating the supplier or deleting a document asks for confirmation naming the supplier or file and the consequence, with a verb button label and focus not on the destructive button
