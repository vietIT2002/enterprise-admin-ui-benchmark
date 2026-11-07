---
id: 27-delivery-note-print
pageType: detail
---
# Delivery note (warehouse / logistics)

## Prompt (EN)
Build the delivery note screen for our warehouse system: one dispatch note with the sender, the customer and delivery address, the goods and quantities being shipped, and room for signatures. It has to be ready to print. Keep it professional.

## Prompt (VI)
Làm màn hình phiếu giao hàng (phiếu xuất kho) cho hệ thống quản lý kho: một phiếu gồm thông tin bên gửi, khách hàng và địa chỉ giao hàng, hàng hóa cùng số lượng xuất, và chỗ ký nhận. Phiếu phải sẵn sàng để in. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The header shows the delivery note number, issue date, source sales order or transfer number and dispatching warehouse, each with a visible label, and every date on the note uses one unambiguous format (such as 06 Nov 2026)
- [ ] Sender (company name, address, tax ID), recipient (customer name, delivery address, contact person and phone) and carrier (carrier name, vehicle plate or driver name) appear in three separately labelled blocks
- [ ] The goods are in a real <table> with column headers in <thead>, giving per line: line number, item code, description, unit of measure, quantity ordered, quantity delivered and lot or serial number, with quantities right-aligned
- [ ] A line delivered short of the ordered quantity states the outstanding amount in words (such as "Backorder: 4 pcs") rather than by colour alone
- [ ] A footer gives the total quantity delivered, the number of packages and the gross weight with its unit, and the quantity total equals the sum of the lines
- [ ] Signature boxes are provided for the warehouse keeper (issued by), the driver or carrier and the receiver, each with room for printed name, signature and date, plus a remarks area for the condition of the goods on receipt
- [ ] A Print control that is a real <button> starts printing, and an @media print stylesheet hides the app navigation and on-screen controls, sets page margins and keeps the signature block from splitting across pages
- [ ] The note's status (such as Draft, Dispatched, Delivered or Cancelled) is shown in words next to its number, and a draft or cancelled note prints with a visible "DRAFT" or "CANCELLED" mark so it cannot pass as a valid dispatch document
- [ ] A loading state is present, and a note that fails to load or does not exist shows a message with Retry and a link back to the delivery note list, never an empty template with blank fields
