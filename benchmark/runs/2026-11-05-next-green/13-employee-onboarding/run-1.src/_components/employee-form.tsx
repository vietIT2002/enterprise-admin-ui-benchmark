"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  BANKS, CITIES, CONTRACT_TYPES, DEPARTMENTS, DUPLICATE_ID_NUMBER, DUPLICATE_OWNER, EMPLOYMENT_TYPES, GENDERS,
  INITIAL, LOCATIONS, MANAGERS, NATIONALITIES, NEXT_EMPLOYEE_ID, OFFER, RELATIONSHIPS,
  type Docs, type FieldKey, type Values,
} from "../_lib/data"
import { LABELS, ORDER, validateAll, validateField, type Errors } from "../_lib/validate"
import { DocumentsSection } from "./documents-section"
import { SelectField, Section, TextField } from "./fields"
import { FormSkeleton } from "./form-skeleton"

const moneyFmt = new Intl.NumberFormat("vi-VN")
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Phase = "loading" | "ready" | "error"

export function EmployeeForm({ state }: { state?: "loading" | "error" | "empty" }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>(state === "error" ? "error" : "loading")
  const [values, setValues] = useState<Values>(INITIAL)
  const [docs, setDocs] = useState<Docs>({})
  const [errors, setErrors] = useState<Errors>({})
  const [duplicate, setDuplicate] = useState(false)
  const [banner, setBanner] = useState("")
  const [saving, setSaving] = useState<"draft" | "final" | null>(null)
  const [draftAt, setDraftAt] = useState<string | null>(null)
  const [created, setCreated] = useState(false)
  const [snapshot, setSnapshot] = useState(() => JSON.stringify({ values: INITIAL, docs: {} }))
  const [leaveTo, setLeaveTo] = useState<string | null>(null)

  const isProbation = values.contractType.startsWith("Probation")
  const dirty = useMemo(() => JSON.stringify({ values, docs }) !== snapshot, [values, docs, snapshot])

  // Skeleton first, then data (about 500 ms). ?state=loading keeps the skeleton, ?state=error shows the error.
  useEffect(() => {
    if (state === "loading" || state === "error") return
    const t = setTimeout(() => setPhase("ready"), 500)
    return () => clearTimeout(t)
  }, [state])

  // Guard 1: reload, tab close, address bar.
  useEffect(() => {
    if (!dirty) return
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", guard)
    return () => window.removeEventListener("beforeunload", guard)
  }, [dirty])

  // Guard 2: in-app links (breadcrumb, sidebar, any anchor).
  useEffect(() => {
    if (!dirty) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null
      if (!a || a.target === "_blank" || a.origin !== window.location.origin) return
      if (a.pathname === window.location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      setLeaveTo(a.pathname + a.search)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [dirty])

  const effective = useCallback((v: Values): Values => ({ ...v, probationEnd: v.contractType.startsWith("Probation") ? v.probationEnd : "" }), [])

  const focusField = useCallback((key: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(key)
      el?.scrollIntoView({ block: "center" })
      el?.focus()
    })
  }, [])

  function setField(key: FieldKey, value: string) {
    const next = { ...values, [key]: value }
    setValues(next)
    setCreated(false)
    if (key === "idNumber") setDuplicate(false)
    // Once a field is invalid, re-check on every change; the message disappears as soon as the value is fixed.
    setErrors((prev) => {
      const out = { ...prev }
      if (prev[key]) {
        const m = validateField(key, effective(next))
        if (m) out[key] = m
        else delete out[key]
      }
      if (key === "startDate" && prev.probationEnd) {
        const m = validateField("probationEnd", effective(next))
        if (m) out.probationEnd = m
        else delete out.probationEnd
      }
      return out
    })
  }

  function blur(key: FieldKey) {
    if (duplicate && key === "idNumber") return
    const m = validateField(key, effective(values))
    setErrors((prev) => {
      const out = { ...prev }
      if (m) out[key] = m
      else delete out[key]
      return out
    })
  }

  async function submit(mode: "draft" | "final") {
    setBanner("")
    const found = validateAll(effective(values), docs, mode === "final")
    setErrors(found)
    setDuplicate(false)
    const firstKey = ORDER.find((k) => found[k]) ?? (found.docs ? "docs" : undefined)
    if (firstKey) {
      focusField(firstKey)
      return
    }
    setSaving(mode)
    try {
      await wait(900)
      if (mode === "final" && values.idNumber === DUPLICATE_ID_NUMBER) {
        setDuplicate(true)
        setErrors({ idNumber: `ID number is already registered to ${DUPLICATE_OWNER}` })
        focusField("idNumber")
        return
      }
      setSnapshot(JSON.stringify({ values, docs }))
      if (mode === "draft") {
        setDraftAt(timeFmt.format(new Date()))
        toast.success(`Draft of ${values.fullName || "new employee"} saved`)
      } else {
        setDraftAt(null)
        setCreated(true)
        toast.success(`Employee ${NEXT_EMPLOYEE_ID} (${values.fullName}) saved`)
      }
    } catch {
      setBanner("Couldn't save the employee. Your input is kept; try again.")
    } finally {
      setSaving(null)
    }
  }

  function cancel() {
    if (dirty) setLeaveTo("/employees")
    else router.push("/employees")
  }

  function retry() {
    setPhase("loading")
    router.replace("/employees/new")
    setTimeout(() => setPhase("ready"), 500)
  }

  const errorList = [...ORDER.filter((k) => errors[k]).map((k) => ({ id: k as string, label: LABELS[k], message: errors[k]! })),
    ...(errors.docs ? [{ id: "docs", label: "Documents", message: errors.docs }] : [])]

  const f = (key: FieldKey) => ({
    name: key,
    value: values[key],
    onChange: (v: string) => setField(key, v),
    error: errorNode(key),
  })
  const t = (key: FieldKey) => ({ ...f(key), onBlur: () => blur(key) })

  function errorNode(key: FieldKey): ReactNode {
    const m = errors[key]
    if (!m) return undefined
    if (key === "idNumber" && duplicate) {
      return (
        <>
          ID number is already registered to{" "}
          <Link href="/employees/NV-2020-0007" className="underline">
            {DUPLICATE_OWNER}
          </Link>
        </>
      )
    }
    return m
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/employees" />}>Employees</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">New employee</h1>
          <Badge variant="secondary">Draft</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Prefilled from accepted offer {OFFER.id} ({OFFER.acceptedOn}, recruiter {OFFER.recruiter}). Employee ID {NEXT_EMPLOYEE_ID} is
          assigned when you save.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">* Required</p>
      </header>

      {phase === "loading" && <FormSkeleton />}

      {phase === "error" && (
        <Alert variant="destructive" className="flex items-start justify-between gap-4">
          <AlertCircle aria-hidden="true" />
          <div>
            <AlertTitle>Couldn&apos;t load departments, managers and banks</AlertTitle>
            <AlertDescription>The lists for this form did not load. Nothing has been entered yet. Check your connection and retry.</AlertDescription>
          </div>
          <Button type="button" variant="outline" onClick={retry}>
            Retry
          </Button>
        </Alert>
      )}

      {phase === "ready" && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            void submit("final")
          }}
          className="space-y-6"
        >
          <div role="alert">
            {banner && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {banner}{" "}
                <button type="button" className="font-medium underline" onClick={() => void submit("final")}>
                  Retry
                </button>
              </p>
            )}
          </div>

          <div role="status">
            {errorList.length >= 3 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                <p className="font-medium">{errorList.length} fields need attention</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {errorList.map((e) => (
                    <li key={e.id}>
                      <a
                        href={`#${e.id}`}
                        className="inline-flex min-h-6 items-center underline"
                        onClick={(ev) => {
                          ev.preventDefault()
                          focusField(e.id)
                        }}
                      >
                        {e.label}: {e.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Section id="personal" title="Personal details" description="As printed on the citizen ID card.">
            <TextField {...t("fullName")} label="Full name" required autoComplete="off" placeholder="Nguyễn Văn An" />
            <TextField {...t("dob")} label="Date of birth" required type="date" width="max-w-40" />
            <SelectField {...f("gender")} label="Gender" options={GENDERS} width="max-w-56" />
            <SelectField {...f("nationality")} label="Nationality" options={NATIONALITIES} width="max-w-56" />
            <TextField
              {...t("idNumber")}
              label="ID number (CCCD)"
              required
              inputMode="numeric"
              placeholder="079088001234"
              width="max-w-56"
              help="12 digits on the citizen ID card."
            />
            <TextField {...t("personalEmail")} label="Personal email" required type="email" placeholder="name@gmail.com" />
            <TextField {...t("mobile")} label="Mobile phone" required type="tel" placeholder="0903 123 456" width="max-w-56" />
            <TextField {...t("address")} label="Street address" required autoComplete="street-address" placeholder="25/3 Nguyễn Trãi, Phường 2, Quận 5" />
            <SelectField {...f("city")} label="City or province" required options={CITIES} width="max-w-72" />
          </Section>

          <Section id="job" title="Job and contract">
            <div className="max-w-xl">
              <p className="mb-1.5 text-sm font-medium leading-5">Employee ID</p>
              <p className="text-sm tabular-nums">{NEXT_EMPLOYEE_ID}</p>
              <p className="mt-1 text-sm text-muted-foreground">Assigned automatically when the employee is saved.</p>
            </div>
            <TextField {...t("jobTitle")} label="Job title" required placeholder="Backend engineer" />
            <SelectField {...f("department")} label="Department" required options={DEPARTMENTS} width="max-w-72" />
            <SelectField {...f("manager")} label="Reports to" options={MANAGERS} />
            <SelectField {...f("location")} label="Work location" options={LOCATIONS} />
            <SelectField {...f("employmentType")} label="Employment type" required options={EMPLOYMENT_TYPES} width="max-w-56" />
            <SelectField {...f("contractType")} label="Contract type" required options={CONTRACT_TYPES} width="max-w-72" />
            <TextField {...t("startDate")} label="Start date" required type="date" width="max-w-40" />
            {isProbation && (
              <TextField
                {...t("probationEnd")}
                label="Probation end date"
                type="date"
                width="max-w-40"
                help="Review is due on this date."
              />
            )}
            <TextField
              name="salary"
              label="Monthly gross salary (VND)"
              required
              inputMode="numeric"
              align="right"
              width="max-w-56"
              placeholder="30.000.000"
              help="Before tax and insurance. Payroll calculates net pay."
              value={values.salary ? moneyFmt.format(Number(values.salary)) : ""}
              onChange={(v) => setField("salary", v.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => blur("salary")}
              error={errorNode("salary")}
            />
          </Section>

          <Section id="bank" title="Bank and tax information" description="Used for payroll, personal income tax and social insurance.">
            <SelectField {...f("bank")} label="Bank" required options={BANKS} width="max-w-72" />
            <TextField {...t("accountNumber")} label="Account number" required inputMode="numeric" placeholder="0071001234567" width="max-w-72" />
            <TextField
              {...t("accountHolder")}
              label="Account holder"
              required
              placeholder="NGUYEN HOANG NAM"
              help="Capital letters without diacritics, as printed on the bank card."
            />
            <TextField {...t("taxCode")} label="Personal tax code" inputMode="numeric" placeholder="8412345678" width="max-w-56" help="Leave empty if the employee has none yet; HR registers one." />
            <TextField {...t("insuranceNumber")} label="Social insurance number" inputMode="numeric" placeholder="7912345678" width="max-w-56" />
          </Section>

          <Section id="emergency" title="Emergency contact">
            <TextField {...t("ecName")} label="Contact name" required placeholder="Trần Thị Lan" />
            <SelectField {...f("ecRelationship")} label="Relationship" required options={RELATIONSHIPS} width="max-w-56" />
            <TextField {...t("ecPhone")} label="Contact phone" required type="tel" placeholder="0912 345 678" width="max-w-56" />
            <TextField {...t("ecEmail")} label="Contact email" type="email" placeholder="name@gmail.com" />
          </Section>

          <Section id="documents" title="Documents" description="PDF, JPG or PNG.">
            <DocumentsSection
              docs={docs}
              onChange={(next) => {
                setDocs(next)
                setCreated(false)
                setErrors((p) => {
                  const { docs: _removed, ...rest } = p
                  void _removed
                  return rest
                })
              }}
              error={errors.docs}
            />
          </Section>

          <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-border bg-card px-6 py-3">
            <span role="status" className="mr-auto text-sm text-muted-foreground sm:mr-0">
              {dirty ? (
                <>
                  <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-amber-500" />
                  Unsaved changes
                </>
              ) : created ? (
                `Employee ${NEXT_EMPLOYEE_ID} saved`
              ) : draftAt ? (
                `Draft saved ${draftAt}`
              ) : null}
              {dirty && draftAt ? ` · Draft saved ${draftAt}` : null}
            </span>
            <Button type="button" variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" variant="outline" disabled={saving !== null} onClick={() => void submit("draft")}>
              {saving === "draft" && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              Save draft
            </Button>
            <Button type="submit" disabled={saving !== null}>
              {saving === "final" && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              Create employee
            </Button>
          </div>
        </form>
      )}

      <AlertDialog open={leaveTo !== null} onOpenChange={(o) => !o && setLeaveTo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes. Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>
              The data entered for {values.fullName || "this employee"} will be lost. Use Save draft to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => {
                const to = leaveTo
                setSnapshot(JSON.stringify({ values, docs }))
                setLeaveTo(null)
                if (to) setTimeout(() => router.push(to), 0)
              }}
            >
              Leave page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
