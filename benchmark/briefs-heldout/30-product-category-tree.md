---
id: 30-product-category-tree
pageType: list
---
# Product category tree (e-commerce back office)

## Prompt (EN)
Build the product categories screen for our e-commerce back office: the category hierarchy as a tree with product counts, and the selected category's details beside it so the team can manage them. Keep it professional.

## Prompt (VI)
Làm màn hình danh mục sản phẩm cho trang quản trị thương mại điện tử: cây phân cấp danh mục kèm số lượng sản phẩm, và thông tin chi tiết của danh mục đang chọn hiển thị bên cạnh để đội ngũ quản lý. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Each category in the tree shows a product count, the page states whether counts include subcategories, and in the sample data every parent's total equals its own products plus the totals of its children
- [ ] The tree exposes its structure to screen readers (role="tree" and "treeitem", or nested lists) with aria-expanded on parent nodes and the selected node marked, and nodes can be expanded, collapsed and selected from the keyboard
- [ ] Searching by name keeps the ancestors of each matching category visible and expanded so its place in the hierarchy is clear, and a search with no matches says so
- [ ] The detail panel shows the selected category's full path (such as "Home › Kitchen › Cookware"), name, URL slug, parent, visibility status, product count with a link to those products, and the last modified date and user
- [ ] Hidden or inactive categories are marked in the tree with a text label or icon (such as "Hidden"), not only by greying out
- [ ] Deleting a category that still has products or subcategories is blocked or requires choosing where to move them, and the confirmation names the category and the counts affected
- [ ] A category can be given a new parent without drag-and-drop (a parent picker or "Move to…" action), and the picker excludes the category itself and its own descendants
- [ ] Selecting another category while the detail form has unsaved edits asks to save or discard first
- [ ] With nothing selected the detail panel shows a prompt instead of blank fields, a catalogue with no categories offers to create the first one, and the tree has loading and load-error-with-retry states
