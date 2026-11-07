---
id: 31-user-access-admin
pageType: list
---
# User accounts administration (system administration)

## Prompt (EN)
Build the user management screen for our admin console: a list of user accounts with role, status and last sign-in, where an administrator can invite people, deactivate accounts and reset passwords. Keep it professional.

## Prompt (VI)
Làm màn hình quản lý người dùng cho trang quản trị hệ thống: danh sách tài khoản kèm vai trò, trạng thái và lần đăng nhập gần nhất, nơi quản trị viên có thể mời người dùng mới, vô hiệu hóa tài khoản và đặt lại mật khẩu. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] Each row shows the user's name and email, role, status in words (such as Active, Invited, Deactivated, Locked) and whether two-factor sign-in is enabled
- [ ] Last sign-in uses one date-time format with the timezone stated, relative times also expose the exact time, and an account that has never signed in shows "Never" rather than a blank or a 1970 date
- [ ] Users can be found by searching name or email and filtered by role, status and inactivity (such as no sign-in for 90+ days), with the number of matching users shown
- [ ] The invite form requires an email and a role, labels both fields, and shows an inline error for a malformed address or one that already has an account
- [ ] Deactivation asks for confirmation that names the user and states the effect (active sessions ended, sign-in blocked, data kept), and a deactivated user is offered Reactivate instead
- [ ] The signed-in administrator's own row is marked (such as "You") and cannot be deactivated or lose the admin role, and the last remaining administrator cannot be deactivated, with the disabled action explaining why
- [ ] Password reset sends a reset link to the user's email address, which the confirmation names, and the administrator never sees, sets or types the new password
- [ ] Row actions are buttons or a keyboard-operable menu whose accessible names include the user (such as "Actions for Mai Nguyen"), and the outcome of an action is announced in an aria-live or role="status" region
- [ ] A search with no matching users shows a message with a way to clear it, and loading and failed-load states with a retry exist
