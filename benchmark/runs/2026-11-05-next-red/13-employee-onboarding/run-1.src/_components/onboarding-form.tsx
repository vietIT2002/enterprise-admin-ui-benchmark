"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "./field";
import {
  contractTypes, departments, documentTypes, locations, managers, nextEmployeeId,
  payFrequencies, relationships, taxClasses,
} from "../_lib/data";

type Values = Record<string, string>;
type Errors = Record<string, string>;

const sections = [
  { id: "personal", title: "Personal details" },
  { id: "job", title: "Job and contract" },
  { id: "bank", title: "Bank and tax" },
  { id: "emergency", title: "Emergency contact" },
  { id: "documents", title: "Documents" },
];

const requiredMsgs: Record<string, string> = {
  firstName: "Enter the first name.",
  lastName: "Enter the last name.",
  dob: "Enter the date of birth.",
  email: "Enter a personal email address.",
  phone: "Enter a mobile number.",
  street: "Enter the street address.",
  city: "Enter the city.",
  postcode: "Enter the postcode.",
  jobTitle: "Enter the job title.",
  department: "Select a department.",
  manager: "Select a line manager.",
  location: "Select a work location.",
  contractType: "Select a contract type.",
  startDate: "Enter the start date.",
  salary: "Enter the gross annual salary.",
  accountHolder: "Enter the account holder name.",
  iban: "Enter the IBAN.",
  taxId: "Enter the tax ID.",
  ecName: "Enter the contact's full name.",
  ecRelation: "Select the relationship.",
  ecPhone: "Enter the contact's phone number.",
};

function validate(v: Values): Errors {
  const e: Errors = {};
  for (const [k, msg] of Object.entries(requiredMsgs)) if (!v[k]?.trim()) e[k] = msg;
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter an email address like name@example.com.";
  if (v.iban && v.iban.replace(/\s/g, "").length < 15) e.iban = "This IBAN looks too short. Check it and try again.";
  if (v.taxId && !/^\d{11}$/.test(v.taxId.replace(/\s/g, ""))) e.taxId = "The tax ID has 11 digits.";
  return e;
}

export function OnboardingForm() {
  const [values, setValues] = React.useState<Values>({
    payFrequency: "Monthly", hoursPerWeek: "40",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [files, setFiles] = React.useState<Record<string, File | undefined>>({});
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [active, setActive] = React.useState("personal");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };
  const setSel = (k: string) => (val: unknown) => {
    setValues((p) => ({ ...p, [k]: String(val ?? "") }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };
  const inv = (k: string) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const requiredDocs = documentTypes.filter((d) => d.required);
  const missingDocs = requiredDocs.filter((d) => !files[d.id]);
  const errorList = Object.entries(errors).filter(([, m]) => m);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSubmitted(true);
    if (Object.keys(found).length || missingDocs.length || !confirmed) {
      document.getElementById("form-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    toast.success(`${values.firstName} ${values.lastName} was added as ${nextEmployeeId}.`, {
      description: `A welcome email with first-day instructions will go out before ${values.startDate}.`,
    });
  }

  function saveDraft() {
    toast.success("Draft saved. You can finish it later from the Employees list.");
  }

  const sel = (k: string, items: string[], placeholder: string) => (
    <Select name={k} value={values[k] || null} onValueChange={setSel(k)}>
      <SelectTrigger id={k} className="w-full" {...inv(k)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  const text = (k: string, extra: React.ComponentProps<typeof Input> = {}) => (
    <Input id={k} name={k} value={values[k] ?? ""} onChange={set(k)} {...inv(k)} {...extra} />
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/employees" />}>Employees</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>New employee</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Onboard a new employee</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Employee ID {nextEmployeeId} will be assigned on save. Fields marked * are required. Sensitive data is visible to People &amp; Culture and Payroll only.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Form sections" className="hidden lg:block">
            <ol className="sticky top-8 flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "step" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${active === s.id ? "bg-muted font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    <span className={`flex size-6 items-center justify-center rounded-full border text-xs ${active === s.id ? "border-primary bg-primary text-primary-foreground" : ""}`}>{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 pb-24">
            {submitted && (errorList.length > 0 || missingDocs.length > 0 || !confirmed) && (
              <Alert variant="destructive" id="form-summary" role="alert" className="scroll-mt-6">
                <AlertTitle>The employee can&apos;t be created yet</AlertTitle>
                <AlertDescription>
                  <ul className="mt-1 list-disc pl-4">
                    {errorList.map(([k, m]) => (
                      <li key={k}><a className="underline" href={`#${k}`}>{m}</a></li>
                    ))}
                    {missingDocs.length > 0 && (
                      <li><a className="underline" href="#documents">Upload: {missingDocs.map((d) => d.label).join(", ")}.</a></li>
                    )}
                    {!confirmed && <li><a className="underline" href="#confirm">Confirm that the information is correct.</a></li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Card id="personal" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Personal details</CardTitle>
                <CardDescription>As shown on the employee&apos;s official ID.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="firstName" label="First name" required error={errors.firstName}>{text("firstName", { autoComplete: "off" })}</Field>
                <Field id="lastName" label="Last name" required error={errors.lastName}>{text("lastName", { autoComplete: "off" })}</Field>
                <Field id="dob" label="Date of birth" required error={errors.dob}>{text("dob", { type: "date" })}</Field>
                <Field id="nationality" label="Nationality">{text("nationality", { placeholder: "e.g. Italian" })}</Field>
                <Field id="email" label="Personal email" required hint="Used for the welcome message before the work account exists." error={errors.email}>
                  {text("email", { type: "email", autoComplete: "off" })}
                </Field>
                <Field id="phone" label="Mobile number" required error={errors.phone}>{text("phone", { type: "tel", placeholder: "+49 151 2345 6789" })}</Field>
                <Field id="street" label="Street and number" required error={errors.street} className="sm:col-span-2">{text("street")}</Field>
                <Field id="postcode" label="Postcode" required error={errors.postcode}>{text("postcode", { inputMode: "numeric" })}</Field>
                <Field id="city" label="City" required error={errors.city}>{text("city")}</Field>
              </CardContent>
            </Card>

            <Card id="job" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Job and contract</CardTitle>
                <CardDescription>Role, reporting line and terms agreed in the offer letter.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="jobTitle" label="Job title" required error={errors.jobTitle}>{text("jobTitle", { placeholder: "e.g. Senior Backend Engineer" })}</Field>
                <Field id="department" label="Department" required error={errors.department}>{sel("department", departments, "Select department")}</Field>
                <Field id="manager" label="Line manager" required error={errors.manager}>{sel("manager", managers, "Select manager")}</Field>
                <Field id="location" label="Work location" required error={errors.location}>{sel("location", locations, "Select location")}</Field>
                <Field id="contractType" label="Contract type" required error={errors.contractType}>{sel("contractType", contractTypes, "Select contract type")}</Field>
                <Field id="startDate" label="Start date" required error={errors.startDate}>{text("startDate", { type: "date" })}</Field>
                <Field id="probation" label="Probation period (months)" hint="Typically 3 or 6 months.">{text("probation", { type: "number", min: 0, max: 12, placeholder: "6" })}</Field>
                <Field id="hoursPerWeek" label="Hours per week">{text("hoursPerWeek", { type: "number", min: 1, max: 60 })}</Field>
                <Field id="salary" label="Gross annual salary (EUR)" required error={errors.salary}>{text("salary", { inputMode: "decimal", placeholder: "68,000" })}</Field>
                <Field id="payFrequency" label="Pay frequency">{sel("payFrequency", payFrequencies, "Select frequency")}</Field>
              </CardContent>
            </Card>

            <Card id="bank" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Bank and tax information</CardTitle>
                <CardDescription>Used by Payroll for salary payments and statutory reporting.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="accountHolder" label="Account holder" required error={errors.accountHolder}>{text("accountHolder")}</Field>
                <Field id="bankName" label="Bank name">{text("bankName", { placeholder: "e.g. Deutsche Kreditbank" })}</Field>
                <Field id="iban" label="IBAN" required hint="Example: DE89 3704 0044 0532 0130 00" error={errors.iban}>
                  {text("iban", { autoComplete: "off", className: "font-mono" })}
                </Field>
                <Field id="bic" label="BIC / SWIFT">{text("bic", { className: "font-mono" })}</Field>
                <Field id="taxId" label="Tax ID" required hint="11 digits, from the tax office letter." error={errors.taxId}>
                  {text("taxId", { inputMode: "numeric", autoComplete: "off", className: "font-mono" })}
                </Field>
                <Field id="taxClass" label="Tax class">{sel("taxClass", taxClasses, "Select tax class")}</Field>
                <Field id="socialSecurity" label="Social security number">{text("socialSecurity", { autoComplete: "off", className: "font-mono" })}</Field>
                <Field id="healthInsurer" label="Health insurer">{text("healthInsurer", { placeholder: "e.g. TK, AOK, Allianz" })}</Field>
              </CardContent>
            </Card>

            <Card id="emergency" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Emergency contact</CardTitle>
                <CardDescription>Someone we can reach if the employee has an accident at work.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="ecName" label="Full name" required error={errors.ecName}>{text("ecName")}</Field>
                <Field id="ecRelation" label="Relationship" required error={errors.ecRelation}>{sel("ecRelation", relationships, "Select relationship")}</Field>
                <Field id="ecPhone" label="Phone number" required error={errors.ecPhone}>{text("ecPhone", { type: "tel" })}</Field>
                <Field id="ecEmail" label="Email">{text("ecEmail", { type: "email" })}</Field>
                <Field id="notes" label="Medical or accessibility notes" hint="Only share what the employee has agreed to disclose." className="sm:col-span-2">
                  <Textarea id="notes" name="notes" rows={3} value={values.notes ?? ""} onChange={set("notes")} />
                </Field>
              </CardContent>
            </Card>

            <Card id="documents" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  {requiredDocs.length - missingDocs.length} of {requiredDocs.length} required documents uploaded.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y rounded-lg border bg-card">
                  {documentTypes.map((d) => {
                    const f = files[d.id];
                    const missing = submitted && d.required && !f;
                    return (
                      <li key={d.id} className="flex flex-wrap items-center gap-3 p-4">
                        <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {d.label}
                            {!d.required && <span className="font-normal text-muted-foreground"> (optional)</span>}
                          </p>
                          {f ? (
                            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
                              {f.name} ({Math.max(1, Math.round(f.size / 1024))} KB)
                            </p>
                          ) : (
                            <p className={`text-sm ${missing ? "text-destructive" : "text-muted-foreground"}`}>
                              {missing ? "Required. " : ""}{d.hint}
                            </p>
                          )}
                        </div>
                        <input
                          id={`file-${d.id}`} type="file" className="peer sr-only" accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => { const file = e.target.files?.[0]; setFiles((p) => ({ ...p, [d.id]: file })); }}
                        />
                        <label
                          htmlFor={`file-${d.id}`}
                          className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 order-last sm:order-none"
                        >
                          <Upload className="size-3.5" aria-hidden /> {f ? "Replace" : "Upload"}
                        </label>
                        {f && (
                          <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${d.label}`}
                            onClick={() => setFiles((p) => ({ ...p, [d.id]: undefined }))}>
                            <X />
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <div id="confirm" className="flex scroll-mt-6 items-start gap-3 rounded-lg border bg-card p-4">
              <Checkbox id="confirmed" checked={confirmed} onCheckedChange={(c) => setConfirmed(c === true)} className="mt-0.5" />
              <Label htmlFor="confirmed" className="font-normal leading-snug">
                I confirm the information is accurate and that the employee has consented to its processing for payroll and HR administration.
              </Label>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-2 px-4 py-3 sm:px-6">
                <Link href="/employees" className="inline-flex h-8 items-center rounded-lg px-2.5 text-sm font-medium hover:bg-muted">Cancel</Link>
                <Button type="button" variant="outline" onClick={saveDraft}>Save draft</Button>
                <Button type="submit">Create employee</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
