import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Contract } from "../_lib/data";
import { date, money } from "../_lib/format";

export function AmendmentsCard({ c }: { c: Contract }) {
  const executed = c.amendments.filter((a) => a.status === "executed");
  const pending = c.amendments.length - executed.length;
  const net = executed.reduce((s, a) => s + a.valueChange, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amendments</CardTitle>
        <CardDescription>
          {executed.length} executed, net {money(net, c.currency, true)} on the
          original value
          {pending > 0 && `, ${pending} pending`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="divide-y">
          {c.amendments.map((a) => (
            <li key={a.number} className="space-y-1.5 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-sm font-semibold">
                  {a.number}: {a.title}
                </h3>
                <Badge variant={a.status === "executed" ? "secondary" : "outline"}>
                  {a.status === "executed" ? "Executed" : "Pending signature"}
                </Badge>
                <span className="ml-auto text-sm font-medium tabular-nums">
                  {money(a.valueChange, c.currency, true)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{a.summary}</p>
              <p className="text-xs text-muted-foreground">
                Effective {date(a.effectiveDate)}. {a.approvedBy}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
