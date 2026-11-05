export const LOCALE = "vi-VN";
export const TIME_ZONE = "Asia/Ho_Chi_Minh";
// Fixed "today" for the mock data (calendar day in Asia/Ho_Chi_Minh).
export const TODAY = "2026-11-05";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const dateUtc = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
const dateZone = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TIME_ZONE });
const timeZone = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: TIME_ZONE });
const num = new Intl.NumberFormat(LOCALE);
const vnd = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "VND" });
const signedVnd = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "VND", signDisplay: "exceptZero" });
const pct = new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 1 });

/** Calendar day (YYYY-MM-DD) or instant (ISO) as dd/MM/yyyy. */
export function formatDate(iso: string) {
  return (DATE_ONLY.test(iso) ? dateUtc : dateZone).format(new Date(iso));
}
export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${dateZone.format(d)} ${timeZone.format(d)}`;
}
export const formatMoney = (v: number) => vnd.format(v);
export const formatSignedMoney = (v: number) => signedVnd.format(v);
/** Number alone, for columns whose header names the currency. */
export const formatAmount = (v: number) => num.format(v);
const signedNum = new Intl.NumberFormat(LOCALE, { signDisplay: "exceptZero" });
export const formatSignedAmount = (v: number) => signedNum.format(v);
export const formatPercent = (ratio: number) => pct.format(ratio);
export const formatNumber = (v: number) => num.format(v);

/** Whole days from `from` to `to` (calendar days). Positive when `to` is later. */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to.slice(0, 10)) - Date.parse(from.slice(0, 10))) / 86_400_000);
}
