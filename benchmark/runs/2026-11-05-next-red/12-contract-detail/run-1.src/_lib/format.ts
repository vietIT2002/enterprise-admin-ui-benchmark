export function money(n: number, currency = "USD", signed = false) {
  const s = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.abs(n));
  if (signed) return `${n < 0 ? "-" : "+"}${s}`;
  return n < 0 ? `-${s}` : s;
}

export function date(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

const DAY = 86_400_000;

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round(
    (new Date(`${toIso}T00:00:00Z`).getTime() -
      new Date(`${fromIso}T00:00:00Z`).getTime()) /
      DAY,
  );
}

export function addDays(iso: string, days: number) {
  return new Date(new Date(`${iso}T00:00:00Z`).getTime() + days * DAY)
    .toISOString()
    .slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
