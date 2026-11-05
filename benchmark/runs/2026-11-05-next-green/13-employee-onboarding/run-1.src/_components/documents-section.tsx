"use client"

import { useRef } from "react"
import { AlertCircle, Download, Eye, MoreHorizontal, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DOC_SLOTS, type Docs } from "../_lib/data"

const sizeFmt = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 })
const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${sizeFmt.format(bytes / 1024 / 1024)} MB` : `${sizeFmt.format(Math.max(1, bytes / 1024))} KB`
const typeOf = (name: string) => (name.split(".").pop() ?? "").toUpperCase()

export function DocumentsSection({
  docs, onChange, error,
}: {
  docs: Docs
  onChange: (next: Docs) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const target = useRef<string>("")

  function pick(key: string) {
    target.current = key
    inputRef.current?.click()
  }

  function onFile(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    onChange({ ...docs, [target.current]: { name: file.name, size: file.size } })
    if (inputRef.current) inputRef.current.value = ""
  }

  const uploaded = DOC_SLOTS.filter((s) => docs[s.key]).length

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onFile(e.target.files)}
      />
      <p className="mb-3 text-sm text-muted-foreground">
        {uploaded} of {DOC_SLOTS.length} documents uploaded. Documents marked * are needed before the employee record is created.
      </p>
      <div id="docs" tabIndex={-1} className="rounded-md border border-border outline-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3">Document</TableHead>
              <TableHead className="px-3">File</TableHead>
              <TableHead className="px-3">Type</TableHead>
              <TableHead className="px-3 text-right">Size</TableHead>
              <TableHead className="px-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DOC_SLOTS.map((slot) => {
              const doc = docs[slot.key]
              return (
                <TableRow key={slot.key} className="h-10">
                  <TableCell className="px-3 py-2.5">
                    <span className="font-medium">{slot.label}</span>
                    {slot.required && <span aria-hidden="true"> *</span>}
                    {slot.required && <span className="sr-only"> (required)</span>}
                  </TableCell>
                  <TableCell className="max-w-64 truncate px-3 py-2.5">
                    {doc ? doc.name : <span className="text-muted-foreground">{slot.hint}</span>}
                  </TableCell>
                  <TableCell className="px-3 py-2.5">{doc ? typeOf(doc.name) : "–"}</TableCell>
                  <TableCell className="px-3 py-2.5 text-right tabular-nums">{doc ? formatSize(doc.size) : "–"}</TableCell>
                  <TableCell className="px-3 py-1 text-right">
                    {doc ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => toast.info(`Preview of ${doc.name} is not available in the demo`)}>
                          <Eye aria-hidden="true" /> Preview
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${doc.name}`)}>
                          <Download aria-hidden="true" /> Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions for ${slot.label}`}>
                                <MoreHorizontal aria-hidden="true" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => pick(slot.key)}>Replace file</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                onChange({ ...docs, [slot.key]: undefined })
                                toast(`Removed ${doc.name}`)
                              }}
                            >
                              Remove file
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" size="sm" aria-label={`Upload ${slot.label}`} onClick={() => pick(slot.key)}>
                        <Upload aria-hidden="true" /> Upload
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {error && (
        <p id="docs-error" className="mt-2 flex items-start gap-1 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
