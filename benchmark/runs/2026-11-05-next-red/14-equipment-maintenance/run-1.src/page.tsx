import { EquipmentTable } from "./_components/equipment-table"
import { equipment, REFERENCE_DATE, statusLabel, type EquipmentStatus } from "./_lib/data"

export const metadata = { title: "Equipment" }

const order: EquipmentStatus[] = ["operational", "maintenance", "fault", "offline"]

export default function EquipmentPage() {
  const counts = order.map((s) => ({
    status: s,
    count: equipment.filter((e) => e.status === s).length,
  }))
  const overdue = equipment.filter(
    (e) => new Date(e.nextInspection) < new Date(REFERENCE_DATE)
  ).length

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Equipment</h1>
        <p className="text-sm text-muted-foreground">
          {equipment.length} machines across all sites. Inspection dates are measured against{" "}
          {new Date(REFERENCE_DATE + "T00:00:00Z").toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })}
          .
        </p>
      </header>

      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {counts.map((c) => (
          <div key={c.status} className="flex items-baseline gap-2">
            <dt className="text-muted-foreground">{statusLabel[c.status]}</dt>
            <dd className="font-semibold tabular-nums">{c.count}</dd>
          </div>
        ))}
        <div className="flex items-baseline gap-2">
          <dt className="text-muted-foreground">Inspection overdue</dt>
          <dd className="font-semibold tabular-nums">{overdue}</dd>
        </div>
      </dl>

      <EquipmentTable items={equipment} />
    </main>
  )
}
