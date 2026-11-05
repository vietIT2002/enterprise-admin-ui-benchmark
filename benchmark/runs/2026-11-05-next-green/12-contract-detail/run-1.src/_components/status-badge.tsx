import { Circle, CircleCheck, CircleX, Clock, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "../_lib/contract-data";

const tones: Record<Tone, { classes: string; Icon: LucideIcon }> = {
  neutral: { classes: "bg-slate-100 text-slate-700", Icon: Circle },
  info: { classes: "bg-blue-50 text-blue-800", Icon: Clock },
  success: { classes: "bg-green-50 text-green-800", Icon: CircleCheck },
  warning: { classes: "bg-amber-50 text-amber-800", Icon: TriangleAlert },
  danger: { classes: "bg-red-50 text-red-800", Icon: CircleX },
};

export function StatusBadge({ tone, children, className }: { tone: Tone; children: string; className?: string }) {
  const { classes, Icon } = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-[200px] items-center gap-1 rounded-full px-2 text-xs leading-5 font-medium",
        classes,
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate" title={children}>
        {children}
      </span>
    </span>
  );
}
