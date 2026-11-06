---
id: 24-org-structure
pageType: list
---
# Organisation structure (HRM)

## Prompt (EN)
Build the organisation structure screen for our HR system: the company's department hierarchy with each unit's manager and headcount, and the details of the selected unit shown beside it. Keep it professional.

## Prompt (VI)
Làm màn hình cơ cấu tổ chức cho hệ thống nhân sự: cây phân cấp phòng ban của công ty, kèm trưởng đơn vị và số lượng nhân sự của từng đơn vị, thông tin chi tiết của đơn vị đang chọn hiển thị bên cạnh. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The hierarchy is an indented tree in which every unit with sub-units expands and collapses, exposed as role="tree"/"treeitem" with aria-expanded (or nested lists whose toggles are buttons with aria-expanded) and operable from the keyboard
- [ ] Each unit shows its total headcount including sub-units alongside its direct staff (such as "42 · 8 direct"), and every parent's total equals its direct staff plus its children's totals
- [ ] Each unit names its manager, and a unit without one shows "Vacant" rather than a blank
- [ ] The selected unit is marked in the tree (aria-selected or aria-current), and the details panel shows its name, code, path from the top (such as "Company › Finance › Accounts Payable"), manager and cost centre or location
- [ ] The details panel compares approved positions with filled ones and gives vacancies as approved minus filled
- [ ] The details panel lists the unit's direct employees with name and job title, and their number equals the unit's direct headcount
- [ ] Searching by unit or manager name expands the ancestors of each match and highlights it, and a search with no match says so
- [ ] Deactivating or moving a unit asks for confirmation in a dialog that names the unit and the number of employees and sub-units affected
- [ ] A unit with no direct employees shows an explicit empty message in the details panel, and loading and error-with-retry states exist for both the tree and the panel
