---
id: 05-csv-import
pageType: wizard
---
# CSV product import (inventory)

## Prompt (EN)
Build a CSV import flow for products in an inventory management system: upload the file, map columns, preview with validation errors, then import.

## Prompt (VI)
Làm luồng nhập danh sách sản phẩm từ file CSV cho hệ thống quản lý kho: tải file lên, ghép cột, xem trước kèm lỗi kiểm tra dữ liệu, rồi nhập.

## Acceptance checklist
- [ ] A stepper names each step and lets the user go back to earlier steps
- [ ] Column mapping auto-matches headers and marks required target fields
- [ ] The preview table shows per-row errors and an error count, and offers to download the failing rows
- [ ] The import shows progress, can continue in the background, and ends with a summary of created, updated and failed rows
- [ ] The flow runs on a page or a full-width panel, not inside a small modal
- [ ] A template file is offered for download before upload
