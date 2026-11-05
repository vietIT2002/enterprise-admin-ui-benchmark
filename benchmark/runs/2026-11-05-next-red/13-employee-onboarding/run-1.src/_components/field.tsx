import * as React from "react";
import { Label } from "@/components/ui/label";

export function Field({
  id, label, required, hint, error, children, className,
}: {
  id: string; label: string; required?: boolean; hint?: string; error?: string;
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label}
        {required ? <span aria-hidden className="text-destructive"> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
