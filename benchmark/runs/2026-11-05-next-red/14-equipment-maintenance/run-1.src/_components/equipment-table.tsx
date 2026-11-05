import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  REFERENCE_DATE,
  statusLabel,
  type Equipment,
  type EquipmentStatus,
} from "../_lib/data"

const statusVariant: Record<EquipmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  operational: "secondary",
  maintenance: "outline",
  fault: "destructive",
  offline: "outline",
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(iso: string) {
  return fmt.format(new Date(iso + "T00:00:00Z"))
}

function daysUntil(iso: string) {
  const ms = new Date(iso + "T00:00:00Z").getTime() - new Date(REFERENCE_DATE + "T00:00:00Z").getTime()
  return Math.round(ms / 86_400_000)
}

function InspectionNote({ iso }: { iso: string }) {
  const d = daysUntil(iso)
  if (d < 0)
    return <span className="font-medium text-destructive">Overdue by {-d} {-d === 1 ? "day" : "days"}</span>
  if (d <= 7)
    return <span className="text-foreground">Due in {d} {d === 1 ? "day" : "days"}</span>
  return null
}

export function EquipmentTable({ items }: { items: Equipment[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Equipment</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last service</TableHead>
            <TableHead>Next inspection</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="px-4 py-3">
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {e.id} · {e.type}
                </div>
              </TableCell>
              <TableCell>{e.location}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[e.status]}>{statusLabel[e.status]}</Badge>
              </TableCell>
              <TableCell className="tabular-nums">{formatDate(e.lastService)}</TableCell>
              <TableCell>
                <div className="tabular-nums">{formatDate(e.nextInspection)}</div>
                <div className="text-xs">
                  <InspectionNote iso={e.nextInspection} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
