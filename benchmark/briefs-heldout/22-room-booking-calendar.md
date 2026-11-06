---
id: 22-room-booking-calendar
pageType: list
---
# Meeting room booking calendar (facilities)

## Prompt (EN)
Build a meeting room booking calendar for our office: rooms against time, with a day view and a week view, so staff can see which rooms are free and book one. Keep it professional.

## Prompt (VI)
Làm lịch đặt phòng họp cho văn phòng: các phòng họp theo khung giờ, có chế độ xem theo ngày và theo tuần, để nhân viên biết phòng nào còn trống và đặt phòng. Giao diện chuyên nghiệp.

## Acceptance checklist
- [ ] The day view lists rooms as rows, each labelled with its capacity (and its floor or equipment), against a time axis that covers working hours and is labelled at least every hour
- [ ] A Day / Week switch marks the active view (aria-pressed, aria-selected or aria-current), Previous / Today / Next controls move the range, and a heading states the date or date range on screen (such as "Mon 2 – Sun 8 Nov 2026")
- [ ] Each booking shows its title or organiser and its start–end time as text, and its block covers exactly that stretch of the time axis (a 09:30–11:00 booking spans one and a half hours)
- [ ] Filters for minimum capacity and for equipment (such as projector or video conferencing) narrow the rooms listed, and the number of matching rooms is shown
- [ ] Choosing a free slot opens a booking form already filled in with that room, date and start time
- [ ] Saving is blocked with an inline message when the time overlaps another booking of the same room (the message names that booking's time and organiser) or when the end is not after the start
- [ ] Cancelling a booking asks for confirmation in a dialog that names the room, date and time and offers a way to keep the booking
- [ ] Free slots and bookings are focusable buttons or links whose accessible names give the room, date, time and status (such as "Lotus room, Thu 5 Nov, 09:00–09:30, free"), not click handlers on bare divs
- [ ] When no rooms match the filters, a message with a clear-filters action takes the place of the grid, and loading and error-with-retry states are built in
