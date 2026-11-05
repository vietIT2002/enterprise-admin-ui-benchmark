import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contract } from "../_lib/data";
import { addDays, date, daysBetween, todayIso } from "../_lib/format";
import { Field } from "./field";

export function RenewalCard({ c }: { c: Contract }) {
  const r = c.renewal;
  const noticeBy = addDays(c.endDate, -r.noticeDays);
  const left = daysBetween(todayIso(), noticeBy);
  const urgent = left >= 0 && left <= 60;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Renewal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={
            urgent
              ? "rounded-lg border border-amber-500/40 bg-amber-500/10 p-3"
              : "rounded-lg border bg-muted/40 p-3"
          }
        >
          <div className="text-xs text-muted-foreground">Notice deadline</div>
          <div className="text-lg font-semibold">{date(noticeBy)}</div>
          <div className="text-sm">
            {left > 0
              ? `${left} days left to give notice`
              : left === 0
                ? "Due today"
                : "Notice window has closed"}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          <Field label="Renewal">{r.autoRenew ? "Automatic" : "Manual"}</Field>
          <Field label="Renewal term">{r.renewalTermMonths} months</Field>
          <Field label="Notice period">{r.noticeDays} days</Field>
          <Field label="Current term ends">{date(c.endDate)}</Field>
        </dl>
        <dl>
          <Field label="Price change on renewal">{r.priceUplift}</Field>
        </dl>
        <p className="text-sm text-muted-foreground">{r.note}</p>
        <div className="flex flex-wrap gap-2">
          <Button>Start renewal review</Button>
          <Button variant="outline">Prepare notice of non-renewal</Button>
        </div>
      </CardContent>
    </Card>
  );
}
