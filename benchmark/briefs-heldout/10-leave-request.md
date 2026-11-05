---
id: 10-leave-request
pageType: form
---
# Leave request form (HRM)

## Prompt (EN)
Build the leave request form for our HR system where an employee picks a leave type, dates, an approver and attaches a document, then submits it. Make it professional.

## Prompt (VI)
Làm form xin nghỉ phép cho hệ thống nhân sự, nơi nhân viên chọn loại nghỉ, ngày nghỉ, người duyệt, đính kèm giấy tờ rồi gửi đơn. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The page has a breadcrumb or back link to the leave list, a title such as "New leave request", and a single-column form with a visible label above every field and no placeholder-only labels
- [ ] Required fields are marked consistently, and optional ones (such as the attachment) are labelled as optional
- [ ] Leave type, start date, end date, approver and reason are present; the approver defaults to the employee's manager and can be changed
- [ ] Start and end dates each allow a full day, morning half or afternoon half, and a single-day request can be set as a half day
- [ ] The remaining leave balance for the chosen type is visible beside the form and updates with the selection, and the requested duration in days (such as 1.5) is calculated and shown live
- [ ] A request that exceeds the balance, or has an end date before the start date, shows an inline error tied to the field with `aria-invalid` and `aria-describedby`, and the entered input is kept
- [ ] The attachment control states accepted file types and size limit, lists the chosen file with a remove button, and is keyboard operable
- [ ] The submit action is a verb label ("Submit request") with a secondary Cancel, shows a busy state while submitting to prevent a double submit, and confirms success with a status message that is announced to assistive technology
- [ ] Leaving the page with unsaved input triggers a warning, and an option to save as draft is offered
