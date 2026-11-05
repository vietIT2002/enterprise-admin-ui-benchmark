import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contract, MilestoneStatus } from "../_lib/data";
import { date, daysBetween, money, todayIso } from "../_lib/format";

const label: Record<MilestoneStatus, string> = {
  paid: "Paid",
  invoiced: "Invoiced",
  upcoming: "Upcoming",
};

export function MilestonesCard({ c }: { c: Contract }) {
  const total = c.milestones.reduce((s, m) => s + m.amount, 0);
  const paid = c.milestones
    .filter((m) => m.status === "paid")
    .reduce((s, m) => s + m.amount, 0);
  const invoiced = c.milestones
    .filter((m) => m.status === "invoiced")
    .reduce((s, m) => s + m.amount, 0);
  const today = todayIso();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment milestones</CardTitle>
        <CardDescription>
          {money(paid, c.currency)} paid of {money(total, c.currency)}
          {invoiced > 0 &&
            `, ${money(invoiced, c.currency)} invoiced and awaiting payment`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="flex h-2 overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`${Math.round((paid / total) * 100)}% paid, ${Math.round((invoiced / total) * 100)}% invoiced`}
        >
          <div
            className="bg-emerald-600"
            style={{ width: `${(paid / total) * 100}%` }}
          />
          <div
            className="bg-amber-500"
            style={{ width: `${(invoiced / total) * 100}%` }}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {c.milestones.map((m) => {
              const late =
                m.status === "invoiced" && daysBetween(m.dueDate, today) > 0;
              return (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-normal">
                    <div className="font-medium">
                      {m.id} {m.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.deliverable}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {date(m.dueDate)}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <Badge
                      variant={
                        m.status === "upcoming"
                          ? "outline"
                          : m.status === "paid"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {label[m.status]}
                    </Badge>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {m.status === "paid" &&
                        m.paidOn &&
                        `${m.invoice}, paid ${date(m.paidOn)}`}
                      {m.status === "invoiced" &&
                        `${m.invoice}${late ? ", milestone date passed" : ""}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money(m.amount, c.currency)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right tabular-nums">
                {money(total, c.currency)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
