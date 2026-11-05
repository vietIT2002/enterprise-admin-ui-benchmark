import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Contract } from "../_lib/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ContactsCard({ c }: { c: Contract }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor contacts</CardTitle>
        <CardDescription>
          {c.vendor.name}, {c.vendor.vendorId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y">
          {c.contacts.map((p) => (
            <li key={p.email} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar>
                <AvatarFallback>{initials(p.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  {p.primary && <Badge variant="secondary">Primary</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{p.role}</div>
                <a
                  href={`mailto:${p.email}`}
                  className="block truncate text-primary underline-offset-4 hover:underline"
                >
                  {p.email}
                </a>
                <a
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  className="tabular-nums text-muted-foreground hover:underline"
                >
                  {p.phone}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <address className="border-t pt-4 text-xs not-italic text-muted-foreground">
          {c.vendor.address}
          <br />
          Tax ID {c.vendor.taxId}
        </address>
      </CardContent>
    </Card>
  );
}
