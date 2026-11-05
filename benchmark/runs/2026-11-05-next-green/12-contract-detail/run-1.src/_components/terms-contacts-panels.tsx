"use client";

import { Download, Eye, ExternalLink, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Contract } from "../_lib/contract-data";
import { formatDate, formatMoney, formatNumber } from "../_lib/format";
import { EmptyState, Fields, Section } from "./shared";

const link = "text-primary underline-offset-2 hover:underline";

export function TermsPanel({ contract: c }: { contract: Contract }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Section title="General">
          <Fields
            items={[
              { label: "Contract type", value: c.type },
              { label: "Department", value: c.department },
              { label: "Contract owner", value: c.owner },
              { label: "Signed on", value: <span className="tabular-nums">{formatDate(c.signedOn)}</span> },
              {
                label: "Term",
                value: (
                  <span className="tabular-nums">
                    {formatDate(c.start)} – {formatDate(c.end)}
                  </span>
                ),
              },
              { label: "Governing law", value: c.governingLaw },
            ]}
          />
        </Section>
        <Section title="Commercial terms">
          <Fields
            items={[
              { label: "Original value", value: <span className="tabular-nums">{formatMoney(c.originalValue)}</span> },
              {
                label: "Current value",
                value: (
                  <span className="tabular-nums">
                    {formatMoney(c.currentValue)}{" "}
                    <span className="text-muted-foreground">after approved amendments</span>
                  </span>
                ),
              },
              { label: "Price basis", value: c.priceBasis },
              { label: "Payment terms", value: c.paymentTerms },
              { label: "Late payment fee", value: c.lateFee },
              { label: "Retention", value: c.retention },
            ]}
          />
        </Section>
      </div>
      <div className="flex flex-col gap-4">
        <Section title="Service and legal terms">
          <Fields
            items={[
              { label: "Service levels", value: c.sla },
              { label: "Liability cap", value: c.liabilityCap },
              { label: "Termination notice", value: c.terminationNotice },
              { label: "Confidentiality", value: c.confidentiality },
            ]}
          />
        </Section>
        <Section
          title="Documents"
          action={
            <Button variant="outline" onClick={() => toast("Upload dialog opens here")}>
              <Plus aria-hidden="true" /> Upload
            </Button>
          }
        >
          {c.attachments.length === 0 ? (
            <EmptyState text="No documents attached yet." actionLabel="Upload document" onAction={() => toast("Upload dialog opens here")} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-3">File</TableHead>
                  <TableHead className="px-3">Type</TableHead>
                  <TableHead className="px-3 text-right">Size (MB)</TableHead>
                  <TableHead className="px-3 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.attachments.map((a) => (
                  <TableRow key={a.name}>
                    <TableCell className="h-10 px-3 py-0">{a.name}</TableCell>
                    <TableCell className="h-10 px-3 py-0">{a.type}</TableCell>
                    <TableCell className="h-10 px-3 py-0 text-right tabular-nums">
                      {new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(a.sizeMb)}
                    </TableCell>
                    <TableCell className="h-10 px-3 py-1 text-right">
                      <div className="flex justify-end gap-1">
                        {a.canPreview ? (
                          <Button variant="ghost" size="sm" aria-label={`Preview ${a.name}`} onClick={() => toast(`Previewing ${a.name}`)}>
                            <Eye aria-hidden="true" /> Preview
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" aria-label={`Download ${a.name}`} onClick={() => toast(`Downloading ${a.name}`)}>
                          <Download aria-hidden="true" /> Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>
      </div>
    </div>
  );
}

export function ContactsPanel({ contract: c }: { contract: Contract }) {
  const v = c.vendor;
  return (
    <div className="flex flex-col gap-4">
      <Section title="Vendor">
        <Fields
          items={[
            { label: "Legal name", value: v.name },
            { label: "Tax code", value: <span className="tabular-nums">{v.taxCode}</span> },
            { label: "Address", value: v.address },
            {
              label: "Website",
              value: (
                <a href={v.website} target="_blank" rel="noreferrer" className={`${link} inline-flex items-center gap-1`}>
                  {v.website.replace("https://", "")}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ),
            },
          ]}
        />
      </Section>
      <Section
        title="Vendor contacts"
        description={c.contacts.length ? `${formatNumber(c.contacts.length)} contacts` : undefined}
        action={
          <Button variant="outline" onClick={() => toast("Add contact form opens here")}>
            <Plus aria-hidden="true" /> Add contact
          </Button>
        }
      >
        {c.contacts.length === 0 ? (
          <EmptyState
            text="No vendor contacts yet. Add the people who handle this contract at the vendor."
            actionLabel="Add contact"
            onAction={() => toast("Add contact form opens here")}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-3">Name</TableHead>
                <TableHead className="px-3">Role</TableHead>
                <TableHead className="px-3">Email</TableHead>
                <TableHead className="px-3">Phone</TableHead>
                <TableHead className="px-3 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.contacts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="h-10 px-3 py-0 font-medium">
                    <span className="inline-flex items-center gap-2">
                      {p.name}
                      {p.primary ? <Badge variant="secondary">Primary</Badge> : null}
                    </span>
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0">{p.role}</TableCell>
                  <TableCell className="h-10 px-3 py-0">
                    <a href={`mailto:${p.email}`} className={link}>
                      {p.email}
                    </a>
                  </TableCell>
                  <TableCell className="h-10 px-3 py-0">
                    <a href={`tel:${p.tel}`} className={`${link} tabular-nums`}>
                      {p.phone}
                    </a>
                  </TableCell>
                  <TableCell className="h-10 px-3 py-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" aria-label={`Actions for contact ${p.name}`} />}
                      >
                        <MoreHorizontal aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast(`Edit ${p.name}`)}>Edit contact</DropdownMenuItem>
                        {!p.primary ? (
                          <DropdownMenuItem onClick={() => toast.success(`${p.name} is now the primary contact`)}>
                            Make primary
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem variant="destructive" onClick={() => toast(`Remove ${p.name}`)}>
                          Remove from contract
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Section>
    </div>
  );
}
