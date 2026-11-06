---
id: 19-chart-of-accounts
pageType: list
---
# Chart of accounts with detail panel (accounting)

## Prompt (EN)
Build the chart of accounts screen for our accounting app: the account hierarchy with balances, and the selected account's details shown beside the tree. Professional look.

## Prompt (VI)
Làm màn hình hệ thống tài khoản kế toán: cây tài khoản nhiều cấp có số dư, và khi chọn một tài khoản thì chi tiết hiện bên cạnh cây. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The hierarchy expands and collapses with indentation, and uses tree semantics (`role="tree"`/`treeitem` with `aria-expanded` and `aria-level`, or a `treegrid`)
- [ ] Keyboard: arrow keys move, expand and collapse, Home and End jump, and a search reveals matching accounts together with their parents
- [ ] Each row shows the account code and name, balances are right-aligned in tabular figures, and a parent's balance equals the sum of its children
- [ ] Selecting an account shows its details on the right without losing the tree's scroll position or expanded state, and the selection is kept in the URL
- [ ] Expand all and collapse all are available, and the expanded state survives a reload
- [ ] Deactivating or deleting an account that has a balance or child accounts is blocked or explained, not silently allowed
- [ ] The detail panel shows the selected account's path (such as "Assets / Current assets / Cash")
- [ ] A search with no match shows a no-results state, and loading and an error with retry are present
- [ ] Rows are single-line, and long account names truncate with the full name available
