"use client";

import { useCallback, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { milestoneStatus, type Contract } from "../_lib/contract-data";
import { TODAY, daysBetween, formatDate, formatDateTime, formatMoney, formatNumber } from "../_lib/format";
import { PaymentsPanel, AmendmentsPanel } from "./payments-amendments-panels";
import { HistoryPanel, RenewalPanel } from "./renewal-history-panels";
import { ErrorState, Section, TableSkeleton } from "./shared";
import { StatusBadge } from "./status-badge";
import { ContactsPanel, TermsPanel } from "./terms-contacts-panels";

type Phase = "loading" | "ready" | "empty" | "error";
type Tab = "terms" | "contacts" | "payments" | "amendments" | "renewal" | "history";

const TABS: { value: Tab; label: string }[] = [
  { value: "terms", label: "Terms" },
  { value: "contacts", label: "Contacts" },
  { value: "payments", label: "Payments" },
  { value: "amendments", label: "Amendments" },
  { value: "renewal", label: "Renewal" },
  { value: "history", label: "History" },
];

function initialPhase(state?: string): Phase {
  if (state === "empty" || state === "error") return state;
  return "loading";
}

export function ContractView({
  contract,
  initialTab,
  state,
}: {
  contract: Contract;
  initialTab?: string;
  state?: string;
}) {
  const [tab, setTab] = useState<Tab>(TABS.some((t) => t.value === initialTab) ? (initialTab as Tab) : "terms");
  const [phase, setPhase] = useState<Phase>(initialPhase(state));
  const [terminating, setTerminating] = useState(false);

  // No ?state: skeleton first, data within about 500 ms. ?state=loading holds the skeleton.
  useEffect(() => {
    if (state) return;
    const t = setTimeout(() => setPhase("ready"), 400);
    return () => clearTimeout(t);
  }, [state]);

  const selectTab = useCallback((value: string) => {
    setTab(value as Tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.replaceState(null, "", url);
  }, []);

  const retry = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("state");
    window.history.replaceState(null, "", url);
    setPhase("loading");
    setTimeout(() => setPhase("ready"), 500);
  }, []);

  const data: Contract =
    phase === "empty"
      ? { ...contract, contacts: [], milestones: [], amendments: [], attachments: [] }
      : contract;

  const noticeLeft = daysBetween(TODAY, contract.renewal.noticeDeadline);
  const unpaid = contract.milestones.filter((m) => !m.paidOn);
  const unpaidTotal = unpaid.reduce((s, m) => s + m.amount, 0);
  const pending = contract.amendments.filter((a) => a.status === "Pending approval");
  const overdueCount = contract.milestones.filter((m) => milestoneStatus(m).tone === "danger").length;

  const counts: Partial<Record<Tab, number>> = {
    contacts: data.contacts.length,
    payments: data.milestones.length,
    amendments: data.amendments.length,
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/contracts">Contracts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{contract.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold">{contract.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="tabular-nums">{contract.id}</span>
              <StatusBadge tone="success">Active</StatusBadge>
              <StatusBadge tone="warning">{`Renewal notice due in ${noticeLeft} days`}</StatusBadge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => selectTab("renewal")}>Start renewal</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="icon" aria-label={`More actions for contract ${contract.id}`} />}
              >
                <MoreHorizontal aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => selectTab("amendments")}>Create amendment</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast(`Downloading ${contract.id}.pdf`)}>Download signed PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Contract duplicated as a draft")}>Duplicate as draft</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setTerminating(true)}>
                  Terminate contract
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <dl className="mt-4 grid gap-4 rounded-md border bg-card px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Vendor</dt>
            <dd className="mt-0.5 font-medium">{contract.vendor.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Contract value</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{formatMoney(contract.currentValue)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Term</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {formatDate(contract.start)} – {formatDate(contract.end)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Renewal notice by</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{formatDate(contract.renewal.noticeDeadline)}</dd>
          </div>
        </dl>

        {phase === "ready" ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {overdueCount > 0 ? `${formatNumber(overdueCount)} payment overdue · ` : ""}
            {formatNumber(unpaid.length)} unpaid milestones ({formatMoney(unpaidTotal)})
            {pending.length > 0 ? ` · ${formatNumber(pending.length)} amendment pending approval` : ""}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted-foreground">
          Last changed by{" "}
          <span className="font-medium text-foreground">{contract.lastChangedBy}</span> on{" "}
          <time dateTime={contract.lastChangedAt} className="tabular-nums">
            {formatDateTime(contract.lastChangedAt)}
          </time>
          {" · "}
          <button type="button" className="text-primary underline-offset-2 hover:underline" onClick={() => selectTab("history")}>
            View history
          </button>
        </p>
      </header>

      <Tabs value={tab} onValueChange={selectTab} className="gap-4">
        <TabsList variant="line" className="h-10 w-full justify-start gap-2 overflow-x-auto border-b pb-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="flex-none px-2">
              {t.label}
              {phase !== "loading" && phase !== "error" && counts[t.value] !== undefined ? (
                <span className="text-xs tabular-nums text-muted-foreground">{formatNumber(counts[t.value]!)}</span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {phase === "loading" ? (
              <Section title={t.label}>
                <TableSkeleton />
              </Section>
            ) : phase === "error" ? (
              <Section title={t.label}>
                <ErrorState what={t.label} onRetry={retry} />
              </Section>
            ) : t.value === "terms" ? (
              <TermsPanel contract={data} />
            ) : t.value === "contacts" ? (
              <ContactsPanel contract={data} />
            ) : t.value === "payments" ? (
              <PaymentsPanel contract={data} />
            ) : t.value === "amendments" ? (
              <AmendmentsPanel contract={data} />
            ) : t.value === "renewal" ? (
              <RenewalPanel contract={data} empty={phase === "empty"} />
            ) : (
              <HistoryPanel contract={data} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={terminating} onOpenChange={setTerminating}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Terminate contract ${contract.id}?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {`The contract with ${contract.vendor.name} ends after the ${contract.terminationNotice} notice period. ${formatNumber(unpaid.length)} unpaid milestones (${formatMoney(unpaidTotal)}) stay payable and ${formatNumber(pending.length)} amendment pending approval is withdrawn.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep contract</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setTerminating(false);
                toast.success(`Termination notice for ${contract.id} prepared`);
              }}
            >
              Terminate contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
