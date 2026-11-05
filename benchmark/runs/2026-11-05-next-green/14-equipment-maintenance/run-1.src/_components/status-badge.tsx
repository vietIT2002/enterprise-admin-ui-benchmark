import type { LucideIcon } from "lucide-react"
import { CircleAlert, CircleCheck, CirclePause, Clock, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_LABEL, type MachineStatus } from "../_lib/data"

export type Tone = "neutral" | "info" | "success" | "warning" | "danger"

const TONE: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-50 text-blue-800",
  success: "bg-green-50 text-green-800",
  warning: "bg-amber-50 text-amber-900",
  danger: "bg-red-50 text-red-800",
}

export function ToneBadge({
  tone,
  icon: Icon,
  children,
}: {
  tone: Tone
  icon?: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs leading-5 font-medium whitespace-nowrap",
        TONE[tone]
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

const STATUS_TONE: Record<MachineStatus, { tone: Tone; icon: LucideIcon }> = {
  operational: { tone: "success", icon: CircleCheck },
  idle: { tone: "neutral", icon: CirclePause },
  maintenance: { tone: "info", icon: Wrench },
  down: { tone: "danger", icon: CircleAlert },
}

export function StatusBadge({ status }: { status: MachineStatus }) {
  const { tone, icon } = STATUS_TONE[status]
  return (
    <ToneBadge tone={tone} icon={icon}>
      {STATUS_LABEL[status]}
    </ToneBadge>
  )
}

export function InspectionBadge({ days }: { days: number }) {
  if (days < 0) {
    const n = -days
    return (
      <ToneBadge tone="danger" icon={CircleAlert}>
        {`Overdue ${n} ${n === 1 ? "day" : "days"}`}
      </ToneBadge>
    )
  }
  if (days === 0) {
    return (
      <ToneBadge tone="warning" icon={Clock}>
        Due today
      </ToneBadge>
    )
  }
  if (days <= 14) {
    return (
      <ToneBadge tone="warning" icon={Clock}>
        {`Due in ${days} ${days === 1 ? "day" : "days"}`}
      </ToneBadge>
    )
  }
  return <span className="text-sm text-muted-foreground tabular-nums">{`In ${days} days`}</span>
}
