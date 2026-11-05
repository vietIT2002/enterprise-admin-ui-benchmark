const LOCALE = "en-GB"

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const numberFormat = new Intl.NumberFormat(LOCALE)

/** Calendar day (YYYY-MM-DD) shown as "05 Nov 2026", unshifted by time zone. */
export const formatDate = (day: string) => dateFormat.format(new Date(day))

export const formatNumber = (n: number) => numberFormat.format(n)

/** Search folding: case- and diacritic-insensitive. */
export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
