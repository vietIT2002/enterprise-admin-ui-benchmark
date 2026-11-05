import { Skeleton } from "@/components/ui/skeleton"

export function FormSkeleton() {
  return (
    <div role="status" aria-label="Loading the employee form" className="space-y-6">
      {[5, 6, 4, 3, 3].map((rows, i) => (
        <div key={i} className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-6 px-6 py-6">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="max-w-xl space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
