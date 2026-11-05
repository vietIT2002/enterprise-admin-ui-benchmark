"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  milestoneStatus,
  sortAmendments,
  sortMilestones,
  type Contract,
} from "../_lib/contract-data";
import {
  formatAmount,
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  formatSignedAmount,
} from "../_lib/format";
import { EmptyState, EmptyValue, Section } from "./shared";
import { StatusBadge } from "./status-badge";

export function PaymentsPanel({ contract: c }: { contract: Contract }) {
  const rows = sortMilestones(c.milestones);
  const total = rows.reduce((s, m) => s + m.amount, 0);
  const paid = rows.filter((m) => m.paidOn).reduce((s, m) => s + m.amount, 0);
  const overdue = rows.filter((m) => milestoneStatus(m).tone === "danger").length;

  return (
    <Section
      title="Payment milestones"
      description={
        rows.length
          ? `Paid ${formatMoney(paid)} of ${formatMoney(total)} (${formatPercent(paid / total)})${
              overdue ? ` · ${formatNumber(overdue)} overdue` : ""
            }`
          : undefined
      }
      action={
        <Button variant="outline" onClick={() => toast("Add milestone form opens here")}>
          <Plus aria-hidden="true" /> Add milestone
        </Button>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          text="No payment milestones yet. Add the dates and amounts this contract is paid against."
          actionLabel="Add milestone"
          onAction={() => toast("Add milestone form opens here")}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3">Milestone</TableHead>
              <TableHead className="px-3">Due date</TableHead>
              <TableHead className="px-3 text-right">Share (%)</TableHead>
              <TableHead className="px-3 text-right">Amount (VND)</TableHead>
              <TableHead className="px-3">Status</TableHead>
              <TableHead className="px-3">Paid on</TableHead>
              <TableHead className="px-3">Invoice</TableHead>
              <TableHead className="px-3 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((m) => {
              const st = milestoneStatus(m);
              return (
                <TableRow key={m.no}>
                  <TableCell className="h-10 px-3 py-0 font-medium">
                    {m.no}. {m.name}
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0 tabular-nums">{formatDate(m.due)}</TableCell>
                  <TableCell className="h-10 px-3 py-0 text-right tabular-nums">
                    {formatPercent(m.share).replace("%", "")}
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0 text-right tabular-nums">{formatAmount(m.amount)}</TableCell>
                  <TableCell className="h-10 px-3 py-0">
                    <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0 tabular-nums">
                    {m.paidOn ? formatDate(m.paidOn) : <EmptyValue />}
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0">{m.invoice ?? <EmptyValue />}</TableCell>
                  <TableCell className="h-10 px-3 py-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!m.paidOn ? (
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Record payment for milestone ${m.no}`}
                          onClick={() => toast.success(`Payment form for milestone ${m.no} opens here`)}
                        >
                          Record payment
                        </Button>
                      ) : null}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon" aria-label={`Actions for milestone ${m.no} ${m.name}`} />}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast(`Milestone ${m.no} opens here`)}>Edit milestone</DropdownMenuItem>
                          {m.invoice ? (
                            <DropdownMenuItem onClick={() => toast(`Invoice ${m.invoice} opens here`)}>
                              View invoice {m.invoice}
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead className="px-3" colSpan={2}>
                Total
              </TableHead>
              <TableCell className="h-10 px-3 py-0 text-right font-medium tabular-nums">
                {formatPercent(rows.reduce((s, m) => s + m.share, 0)).replace("%", "")}
              </TableCell>
              <TableCell className="h-10 px-3 py-0 text-right font-medium tabular-nums">{formatAmount(total)}</TableCell>
              <TableCell colSpan={4} />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Section>
  );
}

export function AmendmentsPanel({ contract: c }: { contract: Contract }) {
  const rows = sortAmendments(c.amendments);
  return (
    <Section
      title="Amendments"
      description={
        rows.length
          ? `Original value ${formatMoney(c.originalValue)} · current value ${formatMoney(c.currentValue)}`
          : undefined
      }
      action={
        <Button variant="outline" onClick={() => toast("New amendment form opens here")}>
          <Plus aria-hidden="true" /> Create amendment
        </Button>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          text="No amendments. Terms, prices and dates changed after signing are recorded here."
          actionLabel="Create amendment"
          onAction={() => toast("New amendment form opens here")}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3">Number</TableHead>
              <TableHead className="px-3">Effective date</TableHead>
              <TableHead className="px-3">Summary</TableHead>
              <TableHead className="px-3 text-right">Value change (VND)</TableHead>
              <TableHead className="px-3">Status</TableHead>
              <TableHead className="px-3">Approval</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.no}>
                <TableCell className="h-10 px-3 py-0 font-medium">{a.no}</TableCell>
                <TableCell className="h-10 px-3 py-0 tabular-nums">{formatDate(a.effective)}</TableCell>
                <TableCell className="h-10 max-w-[26rem] truncate px-3 py-0" title={a.summary}>
                  {a.summary}
                </TableCell>
                <TableCell className="h-10 px-3 py-0 text-right tabular-nums">
                  {a.valueChange === 0 ? "0" : formatSignedAmount(a.valueChange)}
                </TableCell>
                <TableCell className="h-10 px-3 py-0">
                  <StatusBadge tone={a.status === "Approved" ? "success" : "info"}>{a.status}</StatusBadge>
                </TableCell>
                <TableCell className="h-10 px-3 py-0">
                  {a.status === "Approved" ? (
                    <>
                      Approved by {a.approvedBy} ·{" "}
                      <span className="tabular-nums">{formatDate(a.approvedOn!)}</span>
                    </>
                  ) : (
                    <>Waiting for {a.waitingFor}</>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Section>
  );
}
