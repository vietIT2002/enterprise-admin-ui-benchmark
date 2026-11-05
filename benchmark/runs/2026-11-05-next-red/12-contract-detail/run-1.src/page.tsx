import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { contracts } from "./_lib/data";
import { date, daysBetween, money, todayIso } from "./_lib/format";
import { AmendmentsCard } from "./_components/amendments-card";
import { ContactsCard } from "./_components/contacts-card";
import { MilestonesCard } from "./_components/milestones-card";
import { RenewalCard } from "./_components/renewal-card";
import { TermsCard } from "./_components/terms-card";

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = contracts[decodeURIComponent(id)];
  if (!c) notFound();

  const currentValue =
    c.originalValue +
    c.amendments
      .filter((a) => a.status === "executed")
      .reduce((s, a) => s + a.valueChange, 0);
  const daysLeft = daysBetween(todayIso(), c.endDate);
  const statusLabel = {
    active: "Active",
    expiring: "Expiring soon",
    expired: "Expired",
  }[c.status];

  const facts: [string, string][] = [
    ["Current value", money(currentValue, c.currency)],
    ["Term", `${date(c.startDate)} to ${date(c.endDate)}`],
    ["Time remaining", daysLeft > 0 ? `${daysLeft} days` : "Ended"],
    ["Contract owner", c.owner],
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/contracts" />}>
              Contracts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{c.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {c.vendor.name}
            </h1>
            <Badge
              variant={
                c.status === "expired"
                  ? "destructive"
                  : c.status === "expiring"
                    ? "default"
                    : "secondary"
              }
            >
              {statusLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {c.id}. {c.title}
          </p>
        </div>
        <Button variant="outline">
          <Download /> Export PDF
        </Button>
      </header>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
        {facts.map(([k, v]) => (
          <div key={k} className="bg-card p-4">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-base font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <TermsCard c={c} currentValue={currentValue} />
          <MilestonesCard c={c} />
          <AmendmentsCard c={c} />
        </div>
        <div className="space-y-6">
          <RenewalCard c={c} />
          <ContactsCard c={c} />
        </div>
      </div>
    </main>
  );
}
