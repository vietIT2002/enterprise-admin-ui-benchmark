"use client"

import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { FieldKey, Option } from "../_lib/data"

type Common = {
  name: FieldKey
  label: string
  required?: boolean
  help?: string
  error?: ReactNode
  /** Width class sized to the content, e.g. w-40 for a date. */
  width?: string
}

function Shell({ name, label, required, help, error, width = "max-w-xl", children }: Common & { children: ReactNode }) {
  return (
    <div className={cn("w-full", width)}>
      <Label htmlFor={name} className="mb-1.5 block leading-5">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Label>
      {children}
      {help && (
        <p id={`${name}-help`} className="mt-1 text-sm text-muted-foreground">
          {help}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 flex items-start gap-1 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

const describedBy = (name: string, help?: string, error?: ReactNode) =>
  [help ? `${name}-help` : null, error ? `${name}-error` : null].filter(Boolean).join(" ") || undefined

export function TextField({
  value, onChange, onBlur, type = "text", inputMode, placeholder, autoComplete, align, ...common
}: Common & {
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  type?: "text" | "email" | "tel" | "date"
  inputMode?: "numeric" | "decimal" | "tel" | "email"
  placeholder?: string
  autoComplete?: string
  align?: "right"
}) {
  const { name, required, help, error } = common
  return (
    <Shell {...common}>
      <Input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, help, error)}
        className={cn(align === "right" && "text-right tabular-nums")}
      />
    </Shell>
  )
}

export function SelectField({
  value, onChange, options, placeholder = "Choose…", ...common
}: Common & {
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder?: string
}) {
  const { name, required, help, error } = common
  return (
    <Shell {...common}>
      <Select items={options} value={value || null} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger
          id={name}
          className="w-full"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, help, error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Shell>
  )
}

export function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-4 rounded-md border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 id={`${id}-title`} className="text-base font-semibold">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-6 px-6 py-6">{children}</div>
    </section>
  )
}
