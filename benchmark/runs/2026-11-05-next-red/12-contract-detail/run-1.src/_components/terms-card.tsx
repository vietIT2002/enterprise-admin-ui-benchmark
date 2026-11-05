import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Contract } from "../_lib/data";
import { date, money } from "../_lib/format";
import { Field } from "./field";

export function TermsCard({
  c,
  currentValue,
}: {
  c: Contract;
  currentValue: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Contract type">{c.type}</Field>
          <Field label="Signed">{date(c.signedDate)}</Field>
          <Field label="Term">
            {date(c.startDate)} to {date(c.endDate)}
          </Field>
          <Field label="Original value">
            {money(c.originalValue, c.currency)}
          </Field>
          <Field label="Current value">{money(currentValue, c.currency)}</Field>
          <Field label="Payment terms">{c.paymentTerms}</Field>
          <Field label="Contract owner">{c.owner}</Field>
          <Field label="Department">{c.department}</Field>
          <Field label="Cost center">{c.costCenter}</Field>
        </dl>
        <Separator />
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Field label="Service levels">{c.sla}</Field>
          <Field label="Warranty">{c.warranty}</Field>
          <Field label="Retention">{c.retention}</Field>
          <Field label="Liability cap">{c.liabilityCap}</Field>
          <Field label="Termination">{c.terminationClause}</Field>
          <Field label="Governing law">{c.governingLaw}</Field>
        </dl>
      </CardContent>
    </Card>
  );
}
