import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEmpty } from "../_lib/shared-text";

export function Section({
  title,
  description,
  action,
  children,
  id,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section aria-labelledby={`${id ?? title}-heading`} className="rounded-md border bg-card">
      <header className="flex min-h-14 items-center justify-between gap-4 border-b px-4 py-2">
        <div>
          <h2 id={`${id ?? title}-heading`} className="text-base font-semibold">
            {title}
          </h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Fields({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="px-4 py-1 text-sm">
      {items.map((it) => (
        <div key={it.label} className="grid grid-cols-[9rem_1fr] gap-x-4 border-b py-2.5 last:border-0">
          <dt className="text-muted-foreground">{it.label}</dt>
          <dd className="min-w-0 break-words">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyValue() {
  return (
    <>
      <span aria-hidden="true" className="text-muted-foreground">
        {formatEmpty()}
      </span>
      <span className="sr-only">Not set</span>
    </>
  );
}

export function EmptyState({
  text,
  actionLabel,
  onAction,
}: {
  text: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 px-4 py-8 text-sm">
      <p className="text-muted-foreground">{text}</p>
      <Button variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

export function ErrorState({ what, onRetry }: { what: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 px-4 py-6 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-700" aria-hidden="true" />
      <div className="flex flex-col items-start gap-3">
        <p>
          <span className="font-medium">{what} could not be loaded.</span>{" "}
          <span className="text-muted-foreground">Check your connection and try again.</span>
        </p>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex h-10 items-center gap-6 px-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-28" />
        </div>
      ))}
    </div>
  );
}
