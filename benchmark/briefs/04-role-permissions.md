---
id: 04-role-permissions
pageType: settings
---
# Roles and permission matrix (admin)

## Prompt (EN)
Create a roles and permissions screen for an admin panel: a list of roles and a permission matrix (modules × actions: view, create, edit, delete, approve) for the selected role.

## Prompt (VI)
Tạo màn hình vai trò và phân quyền cho trang quản trị: danh sách vai trò và ma trận quyền (phân hệ × thao tác: xem, tạo, sửa, xóa, duyệt) cho vai trò đang chọn.

## Acceptance checklist
- [ ] The matrix is a real table with row and column headers; every checkbox has an accessible name combining module and action
- [ ] Rows or columns can be toggled in bulk, with an indeterminate state when partially selected
- [ ] Changes use an explicit save with a visible unsaved-changes indicator and a warning when leaving
- [ ] System or locked roles are read-only and say why
- [ ] Deleting a role asks for confirmation naming the role and how many users it affects
- [ ] The screen shows who last changed the role and when, or links to its audit history
- [ ] All controls are keyboard operable and pointer targets are at least 24px
