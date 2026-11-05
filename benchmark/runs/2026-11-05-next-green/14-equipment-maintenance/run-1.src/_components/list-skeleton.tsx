import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton rows at the final column widths; used inside the table body and as the Suspense fallback. */
export function SkeletonRows({ rows = 10 }: { rows?: number }) {
  const widths = ["w-4", "w-16", "w-44", "w-36", "w-28", "w-24", "w-24", "w-24", "w-6"]
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="h-10 border-b">
          {widths.map((w, c) => (
            <td key={c} className="px-3 py-0">
              <Skeleton className={`h-4 ${w}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function ListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading equipment">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-6 h-8 w-96" />
      <Skeleton className="mt-4 h-8 w-full max-w-[640px]" />
      <div className="mt-4 rounded-md border bg-card">
        <table className="w-full">
          <tbody>
            <SkeletonRows />
          </tbody>
        </table>
      </div>
    </div>
  )
}
