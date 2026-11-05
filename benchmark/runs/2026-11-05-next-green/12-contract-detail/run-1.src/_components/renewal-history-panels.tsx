"use client";

import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Contract } from "../_lib/contract-data";
import { TODAY, daysBetween, formatDate, formatDateTime } from "../_lib/format";
import { EmptyState, Fields, Section } from "./shared";
import { StatusBadge } from "./status-badge";

export function RenewalPanel({ contract: c, empty }: { contract: Contract; empty?: boolean }) {
  if (empty) {
    return (
      <Section title="Renewal">
        <EmptyState
          text="No renewal plan yet. Set the notice period and renewal term so nobody misses the deadline."
          actionLabel="Set up renewal"
          onAction={() => toast("Renewal setup opens here")}
        />
      </Section>
    );
  }
  const r = c.renewal;
  const left = daysBetween(TODAY, r.noticeDeadline);
  return (
    <div className="flex flex-col gap-4">
      <div
        role="status"
        className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-medium">
            Renewal notice is due in {left} days, by <span className="tabular-nums">{formatDate(r.noticeDeadline)}</span>.
          </span>{" "}
          This contract does not renew automatically. If written notice is not sent by then, it ends on{" "}
          <span className="tabular-nums">{formatDate(c.end)}</span>.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Renewal terms">
          <Fields
            items={[
              { label: "Automatic renewal", value: r.autoRenew ? "Yes" : "No, written renewal required" },
              { label: "Renewal term", value: `${r.termMonths} months` },
              { label: "Notice period", value: `${r.noticeDays} days before expiry` },
              { label: "Notice deadline", value: <span className="tabular-nums">{formatDate(r.noticeDeadline)}</span> },
              { label: "Expires on", value: <span className="tabular-nums">{formatDate(c.end)}</span> },
              { label: "Proposed changes", value: r.proposedChange },
              { label: "Previous contract", value: r.previousContract },
            ]}
          />
        </Section>
        <Section title="Renewal steps">
          <ol className="divide-y text-sm">
            {r.steps.map((s, i) => (
              <li key={s.name} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-medium">
                    {i + 1}. {s.name}
                  </p>
                  <p className="text-muted-foreground">{s.note}</p>
                </div>
                <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

export function HistoryPanel({ contract: c }: { contract: Contract }) {
  return (
    <Section title="History" description="Newest first. History is kept for 7 years.">
      {c.history.length === 0 ? (
        <EmptyState text="No changes recorded yet." actionLabel="Open contract terms" onAction={() => undefined} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3">When</TableHead>
              <TableHead className="px-3">Who</TableHead>
              <TableHead className="px-3">What</TableHead>
              <TableHead className="px-3">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {c.history.map((h) => (
              <TableRow key={h.at}>
                <TableCell className="h-10 px-3 py-0 tabular-nums">
                  <time dateTime={h.at}>{formatDateTime(h.at)}</time>
                </TableCell>
                <TableCell className="h-10 px-3 py-0">{h.who}</TableCell>
                <TableCell className="h-10 px-3 py-0">{h.what}</TableCell>
                <TableCell className="h-10 max-w-[28rem] truncate px-3 py-0" title={h.detail}>
                  {h.detail}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Section>
  );
}
