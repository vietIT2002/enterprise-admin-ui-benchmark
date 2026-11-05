"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AREAS,
  EQUIPMENT,
  STATUS_LABEL,
  STATUS_ORDER,
  URGENCY_RANK,
  daysUntil,
  urgencyOf,
  type Machine,
  type MachineStatus,
} from "../_lib/data"
import { fold, formatDate, formatNumber } from "../_lib/format"
import { SkeletonRows } from "./list-skeleton"
import { InspectionBadge, StatusBadge } from "./status-badge"

const COLUMNS = 9
const PAGE_SIZES = [10, 25, 50]
const DEFAULT_SIZE = 25

const INSPECTION_FILTERS = [
  { value: "all", label: "All" },
  { value: "overdue", label: "Overdue" },
  { value: "14", label: "Due within 14 days" },
  { value: "30", label: "Due within 30 days" },
]
const AREA_ITEMS = [{ value: "all", label: "All locations" }, ...AREAS.map((a) => ({ value: a, label: a }))]

type SortField = "name" | "last_service" | "next_inspection"
const SORT_FIELDS: SortField[] = ["name", "last_service", "next_inspection"]

function parseSort(raw: string | null): { field: SortField | null; desc: boolean } {
  const desc = !!raw?.startsWith("-")
  const field = (desc ? raw!.slice(1) : raw) as SortField | null
  return field && SORT_FIELDS.includes(field) ? { field, desc } : { field: null, desc: false }
}

function compareMachines(a: Machine, b: Machine, field: SortField | null, desc: boolean) {
  if (field === null) {
    // Attention first: overdue, then due soon, then the rest, each group by date.
    return (
      URGENCY_RANK[urgencyOf(a)] - URGENCY_RANK[urgencyOf(b)] ||
      a.nextInspection.localeCompare(b.nextInspection) ||
      a.id.localeCompare(b.id)
    )
  }
  const dir = desc ? -1 : 1
  if (field === "name") return dir * (a.name.localeCompare(b.name, "en") || a.id.localeCompare(b.id))
  if (field === "last_service") return dir * (a.lastService.localeCompare(b.lastService) || a.id.localeCompare(b.id))
  return dir * (a.nextInspection.localeCompare(b.nextInspection) || a.id.localeCompare(b.id))
}

export function EquipmentList() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const forced = sp.get("state")
  const statusParam = sp.get("status")
  const status = STATUS_ORDER.includes(statusParam as MachineStatus) ? (statusParam as MachineStatus) : null
  const areaParam = sp.get("location")
  const area = AREAS.includes(areaParam as (typeof AREAS)[number]) ? areaParam : null
  const inspParam = sp.get("inspection")
  const insp = INSPECTION_FILTERS.some((f) => f.value === inspParam && f.value !== "all") ? inspParam : null
  const q = (sp.get("q") ?? "").trim()
  const { field: sortField, desc: sortDesc } = parseSort(sp.get("sort"))
  const sizeRaw = Number(sp.get("size"))
  const size = PAGE_SIZES.includes(sizeRaw) ? sizeRaw : DEFAULT_SIZE

  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [searchText, setSearchText] = useState(sp.get("q") ?? "")
  const headerCheckbox = useRef<HTMLElement | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // First load resolves within about 500 ms; ?state=loading holds the skeleton.
  useEffect(() => {
    if (forced === "loading") return
    const t = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(t)
  }, [forced])

  function update(patch: Record<string, string | null>, mode: "replace" | "push" = "replace") {
    const next = new URLSearchParams(sp.toString())
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k)
      else next.set(k, v)
    }
    if (!("page" in patch)) next.delete("page")
    setSelected(new Set())
    const qs = next.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    if (mode === "push") router.push(url, { scroll: false })
    else router.replace(url, { scroll: false })
  }

  // Search applies after a 300 ms pause.
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchText.trim() !== q) update({ q: searchText.trim() || null })
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  const loading = forced === "loading" || (!ready && forced !== "error")
  const failed = forced === "error"
  const all = forced === "empty" ? [] : EQUIPMENT

  const matchesFilters = (m: Machine, ignoreStatus: boolean) => {
    if (!ignoreStatus && status && m.status !== status) return false
    if (area && m.area !== area) return false
    if (insp) {
      const d = daysUntil(m.nextInspection)
      if (insp === "overdue" ? d >= 0 : d > Number(insp)) return false
    }
    if (q) {
      const hay = fold(`${m.id} ${m.name} ${m.area} ${m.bay}`)
      if (!hay.includes(fold(q))) return false
    }
    return true
  }

  const { rows, counts, baseTotal } = useMemo(() => {
    const base = all.filter((m) => matchesFilters(m, true))
    const counts: Record<string, number> = { all: base.length }
    for (const s of STATUS_ORDER) counts[s] = base.filter((m) => m.status === s).length
    const rows = (status ? base.filter((m) => m.status === status) : base).sort((a, b) =>
      compareMachines(a, b, sortField, sortDesc)
    )
    return { rows, counts, baseTotal: base.length }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, status, area, insp, q, sortField, sortDesc])

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / size))
  const pageRaw = Number.parseInt(sp.get("page") ?? "1", 10)
  const page = Number.isFinite(pageRaw) ? Math.min(Math.max(pageRaw, 1), pageCount) : 1
  const start = (page - 1) * size
  const pageRows = rows.slice(start, start + size)

  const hasFilters = !!(status || area || insp || q)
  const overdueCount = rows.filter((m) => urgencyOf(m) === "overdue").length

  // Selection
  const pageIds = pageRows.map((m) => m.id)
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length
  const pageAllSelected = pageIds.length > 0 && selectedOnPage === pageIds.length
  const allMatching = total > 0 && selected.size === total
  const selCount = selected.size

  function togglePage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const id of pageIds) {
        if (checked) next.add(id)
        else next.delete(id)
      }
      return next
    })
  }
  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }
  function cancelSelection() {
    setSelected(new Set())
    requestAnimationFrame(() => headerCheckbox.current?.focus())
  }

  function clearAll() {
    setSearchText("")
    update({ q: null, status: null, location: null, inspection: null })
    searchRef.current?.focus()
  }

  function onSort(field: SortField) {
    if (sortField === field && !sortDesc) update({ sort: `-${field}` })
    else if (sortField === field && sortDesc) update({ sort: null })
    else update({ sort: field })
  }

  function notConnected(action: string, id?: string) {
    toast(id ? `${action}: ${id}` : action, { description: "This action is not connected in the preview." })
  }

  function retry() {
    setReady(false)
    update({ state: null })
  }

  const chips: { key: string; label: string; clear: () => void }[] = []
  if (status) chips.push({ key: "status", label: `Status: ${STATUS_LABEL[status]}`, clear: () => update({ status: null }) })
  if (area) chips.push({ key: "location", label: `Location: ${area}`, clear: () => update({ location: null }) })
  if (insp)
    chips.push({
      key: "inspection",
      label: `Inspection: ${INSPECTION_FILTERS.find((f) => f.value === insp)!.label}`,
      clear: () => update({ inspection: null }),
    })
  if (q)
    chips.push({
      key: "q",
      label: `Search: ${q}`,
      clear: () => {
        setSearchText("")
        update({ q: null })
      },
    })

  const showCounts = !loading && !failed

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Equipment</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => notConnected("Export equipment list")}>
            <Download aria-hidden="true" />
            Export
          </Button>
          <Button onClick={() => notConnected("Add equipment")}>
            <Plus aria-hidden="true" />
            Add equipment
          </Button>
        </div>
      </header>

      <Tabs
        className="mt-4"
        value={status ?? "all"}
        onValueChange={(v) => update({ status: v === "all" ? null : String(v) }, "push")}
      >
        <TabsList variant="line" aria-label="Filter by machine status">
          {[{ value: "all", label: "All" }, ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))].map(
            (t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3">
                {t.label}
                {showCounts ? (
                  <span className="ml-1 text-muted-foreground tabular-nums">{formatNumber(counts[t.value])}</span>
                ) : null}
              </TabsTrigger>
            )
          )}
        </TabsList>
      </Tabs>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={searchRef}
            type="search"
            aria-label="Search equipment"
            placeholder="Search ID, machine, location"
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") update({ q: searchText.trim() || null })
            }}
          />
        </div>
        <Select
          value={area ?? "all"}
          items={AREA_ITEMS}
          onValueChange={(v) => update({ location: v === "all" ? null : String(v) })}
        >
          <SelectTrigger aria-label="Filter by location" className="min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AREA_ITEMS.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={insp ?? "all"}
          items={INSPECTION_FILTERS}
          onValueChange={(v) => update({ inspection: v === "all" ? null : String(v) })}
        >
          <SelectTrigger aria-label="Filter by next inspection" className="min-w-52">
            <span className="text-muted-foreground">Next inspection:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INSPECTION_FILTERS.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Applied filters" role="group">
          {chips.map((c) => (
            <span
              key={c.key}
              className="inline-flex h-7 items-center gap-1 rounded-full border bg-card pr-1 pl-3 text-sm"
            >
              {c.label}
              <button
                type="button"
                aria-label={`Remove filter ${c.label}`}
                onClick={c.clear}
                className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
          <Button variant="link" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      ) : null}

      <p role="status" className="sr-only">
        {loading || failed ? "" : total === 0 ? "No equipment matches" : `${total} machines match`}
      </p>

      {selCount > 0 ? (
        <div className="mt-4 flex h-10 items-center gap-3 rounded-t-md border border-b-0 bg-muted px-3 text-sm">
          <span className="font-medium tabular-nums">{formatNumber(selCount)} selected</span>
          {allMatching && total > pageRows.length ? (
            <>
              <span className="text-muted-foreground">All {formatNumber(total)} matching selected</span>
              <Button variant="link" size="sm" onClick={() => setSelected(new Set())}>
                Clear selection
              </Button>
            </>
          ) : pageAllSelected && total > pageRows.length ? (
            <Button variant="link" size="sm" onClick={() => setSelected(new Set(rows.map((m) => m.id)))}>
              Select all {formatNumber(total)} matching
            </Button>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => notConnected(`Export ${selCount} machines`)}>
              Export selected
            </Button>
            <Button variant="outline" size="sm" onClick={() => notConnected(`Schedule inspection for ${selCount} machines`)}>
              Schedule inspection
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelSelection}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 flex h-10 items-center text-sm text-muted-foreground">
          {loading || failed ? (
            " "
          ) : (
            <>
              <span className="tabular-nums">{formatNumber(total)}</span>&nbsp;{total === 1 ? "machine" : "machines"}
              {overdueCount > 0 ? (
                <>
                  <span aria-hidden="true">&nbsp;·&nbsp;</span>
                  <span className="tabular-nums">{formatNumber(overdueCount)}</span>&nbsp;
                  {overdueCount === 1 ? "inspection overdue" : "inspections overdue"}
                </>
              ) : null}
              {sortField === null && total > 0 ? <span>&nbsp;·&nbsp;Overdue and due soon first</span> : null}
            </>
          )}
        </p>
      )}

      <div className={`border bg-card ${selCount > 0 ? "rounded-b-md" : "rounded-md"}`}>
        <Table aria-label="Equipment" aria-busy={loading} className="text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-3">
                <Checkbox
                  ref={(el) => {
                    headerCheckbox.current = el as HTMLElement | null
                  }}
                  aria-label="Select all rows on this page"
                  checked={pageAllSelected}
                  indeterminate={selectedOnPage > 0 && !pageAllSelected}
                  disabled={pageRows.length === 0}
                  onCheckedChange={(c) => togglePage(c)}
                />
              </TableHead>
              <TableHead className="px-3">Asset ID</TableHead>
              <SortHead label="Machine" field="name" sortField={sortField} desc={sortDesc} onSort={onSort} />
              <TableHead className="px-3">Location</TableHead>
              <TableHead className="px-3">Status</TableHead>
              <SortHead label="Last service" field="last_service" sortField={sortField} desc={sortDesc} onSort={onSort} />
              <SortHead label="Next inspection" field="next_inspection" sortField={sortField} desc={sortDesc} onSort={onSort} />
              <TableHead className="px-3">Inspection</TableHead>
              <TableHead className="w-12 px-3">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={10} />
            ) : failed ? (
              <StateRow>
                <p className="font-medium">Couldn&apos;t load equipment</p>
                <p className="mt-1 text-muted-foreground">Check your connection and try again.</p>
                <Button className="mt-3" variant="outline" onClick={retry}>
                  Retry
                </Button>
              </StateRow>
            ) : forced === "empty" || (baseTotal === 0 && !hasFilters && all.length === 0) ? (
              <StateRow>
                <p className="font-medium">No equipment yet</p>
                <p className="mt-1 text-muted-foreground">Machines you register appear here with their service and inspection dates.</p>
                <Button className="mt-3" onClick={() => notConnected("Add equipment")}>
                  <Plus aria-hidden="true" />
                  Add equipment
                </Button>
              </StateRow>
            ) : pageRows.length === 0 ? (
              <StateRow>
                <p className="font-medium">
                  {q ? `No equipment matches "${q}"` : "No equipment matches these filters"}
                </p>
                <p className="mt-1 text-muted-foreground">Check the spelling or widen the filters.</p>
                <Button className="mt-3" variant="outline" onClick={clearAll}>
                  Clear filters
                </Button>
              </StateRow>
            ) : (
              pageRows.map((m) => {
                const days = daysUntil(m.nextInspection)
                const isSel = selected.has(m.id)
                return (
                  <TableRow key={m.id} className="h-10" data-state={isSel ? "selected" : undefined}>
                    <TableCell className="px-3 py-0">
                      <Checkbox
                        aria-label={`Select machine ${m.id}`}
                        checked={isSel}
                        onCheckedChange={(c) => toggleRow(m.id, c)}
                      />
                    </TableCell>
                    <TableCell className="px-3 py-0 font-medium tabular-nums">{m.id}</TableCell>
                    <TableCell className="px-3 py-0">{m.name}</TableCell>
                    <TableCell className="px-3 py-0">{`${m.area} · ${m.bay}`}</TableCell>
                    <TableCell className="px-3 py-0">
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="px-3 py-0 tabular-nums">
                      <time dateTime={m.lastService}>{formatDate(m.lastService)}</time>
                    </TableCell>
                    <TableCell className="px-3 py-0 tabular-nums">
                      <time dateTime={m.nextInspection}>{formatDate(m.nextInspection)}</time>
                    </TableCell>
                    <TableCell className="px-3 py-0">
                      <InspectionBadge days={days} />
                    </TableCell>
                    <TableCell className="px-3 py-0 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for machine ${m.id}`}
                          disabled={selCount > 0}
                          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => notConnected("View details", m.id)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => notConnected("Log service", m.id)}>Log service</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => notConnected("Schedule inspection", m.id)}>
                            Schedule inspection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => notConnected("Report breakdown", m.id)}>
                            Report breakdown
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && !failed && total > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground tabular-nums">
            {formatNumber(start + 1)}–{formatNumber(start + pageRows.length)} of {formatNumber(total)}
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-muted-foreground">
              Rows per page
              <Select
                value={String(size)}
                items={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
                onValueChange={(v) => update({ size: Number(v) === DEFAULT_SIZE ? null : String(v) })}
              >
                <SelectTrigger aria-label="Rows per page" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => update({ page: page - 1 <= 1 ? null : String(page - 1) }, "push")}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <span className="px-2 tabular-nums">
                Page {page} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={() => update({ page: String(page + 1) }, "push")}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StateRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={COLUMNS} className="py-12 text-center">
        <div className="mx-auto flex max-w-sm flex-col items-center">{children}</div>
      </TableCell>
    </TableRow>
  )
}

function SortHead({
  label,
  field,
  sortField,
  desc,
  onSort,
}: {
  label: string
  field: SortField
  sortField: SortField | null
  desc: boolean
  onSort: (f: SortField) => void
}) {
  const active = sortField === field
  return (
    <TableHead
      className="group/th px-3"
      aria-sort={active ? (desc ? "descending" : "ascending") : undefined}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 rounded-sm text-left font-medium focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {label}
        {active ? (
          desc ? (
            <ChevronDown className="size-4" aria-hidden="true" />
          ) : (
            <ChevronUp className="size-4" aria-hidden="true" />
          )
        ) : (
          <ChevronUp
            className="size-4 text-muted-foreground opacity-0 group-focus-within/th:opacity-100 group-hover/th:opacity-100"
            aria-hidden="true"
          />
        )}
      </button>
    </TableHead>
  )
}
