export type MilestoneStatus = "paid" | "invoiced" | "upcoming";

export type Milestone = {
  id: string;
  name: string;
  deliverable: string;
  dueDate: string;
  amount: number;
  status: MilestoneStatus;
  paidOn?: string;
  invoice?: string;
};

export type Contact = {
  name: string;
  role: string;
  email: string;
  phone: string;
  primary?: boolean;
};

export type Amendment = {
  number: string;
  title: string;
  effectiveDate: string;
  summary: string;
  valueChange: number;
  approvedBy: string;
  status: "executed" | "pending";
};

export type Contract = {
  id: string;
  title: string;
  status: "active" | "expiring" | "expired";
  vendor: { name: string; vendorId: string; address: string; taxId: string };
  type: string;
  owner: string;
  department: string;
  costCenter: string;
  currency: string;
  originalValue: number;
  startDate: string;
  endDate: string;
  signedDate: string;
  paymentTerms: string;
  governingLaw: string;
  liabilityCap: string;
  terminationClause: string;
  warranty: string;
  sla: string;
  retention: string;
  renewal: {
    autoRenew: boolean;
    renewalTermMonths: number;
    noticeDays: number;
    priceUplift: string;
    note: string;
  };
  contacts: Contact[];
  milestones: Milestone[];
  amendments: Amendment[];
};

export const contracts: Record<string, Contract> = {
  "HD-2026-0187": {
    id: "HD-2026-0187",
    title: "Building management system upgrade and 12-month support",
    status: "expiring",
    vendor: {
      name: "Halden Dynamics Ltd.",
      vendorId: "V-004512",
      address: "48 Quayside Road, Rotterdam, 3011 AD, Netherlands",
      taxId: "NL 8123.45.678.B01",
    },
    type: "Services and equipment",
    owner: "Marta Kowalczyk",
    department: "Facilities and Real Estate",
    costCenter: "CC-2210 Facilities Capex",
    currency: "USD",
    originalValue: 1_600_000,
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    signedDate: "2026-03-18",
    paymentTerms: "Net 30 from invoice approval",
    governingLaw: "State of New York, USA",
    liabilityCap: "125% of total contract value",
    terminationClause:
      "Either party may terminate for convenience with 60 days written notice. Fees for accepted milestones remain payable.",
    warranty: "24 months from final acceptance, parts and labour",
    sla: "4-hour response and 24-hour on-site fix for severity 1 faults, 99.5% monthly uptime",
    retention: "10% held on the final milestone until acceptance",
    renewal: {
      autoRenew: true,
      renewalTermMonths: 12,
      noticeDays: 90,
      priceUplift: "Capped at 3.5% or CPI, whichever is lower",
      note: "Renews automatically for the support scope only. Written notice of non-renewal is required before the notice deadline.",
    },
    contacts: [
      {
        name: "Jonas Verhoeven",
        role: "Account director",
        email: "j.verhoeven@haldendynamics.example",
        phone: "+31 10 555 0142",
        primary: true,
      },
      {
        name: "Priya Raman",
        role: "Project manager",
        email: "p.raman@haldendynamics.example",
        phone: "+31 10 555 0178",
      },
      {
        name: "Eleni Papadakis",
        role: "Billing and collections",
        email: "ar@haldendynamics.example",
        phone: "+31 10 555 0110",
      },
      {
        name: "Support desk",
        role: "Severity 1 escalation, 24/7",
        email: "support@haldendynamics.example",
        phone: "+31 10 555 0199",
      },
    ],
    milestones: [
      {
        id: "M1",
        name: "Kickoff and site survey",
        deliverable: "Signed survey report for all 6 buildings",
        dueDate: "2026-04-15",
        amount: 320_000,
        status: "paid",
        paidOn: "2026-05-14",
        invoice: "INV-88213",
      },
      {
        id: "M2",
        name: "Phase 1 installation",
        deliverable: "Controllers live in buildings A to C",
        dueDate: "2026-07-31",
        amount: 480_000,
        status: "paid",
        paidOn: "2026-09-02",
        invoice: "INV-88954",
      },
      {
        id: "M3",
        name: "Phase 2 installation",
        deliverable: "Controllers live in buildings D to F",
        dueDate: "2026-10-30",
        amount: 480_000,
        status: "invoiced",
        invoice: "INV-89420",
      },
      {
        id: "M4",
        name: "Commissioning and training",
        deliverable: "Site acceptance tests, 40 staff trained",
        dueDate: "2027-01-31",
        amount: 360_000,
        status: "upcoming",
      },
      {
        id: "M5",
        name: "Final acceptance and retention",
        deliverable: "Signed acceptance certificate, as-built documents",
        dueDate: "2027-03-15",
        amount: 200_000,
        status: "upcoming",
      },
    ],
    amendments: [
      {
        number: "Amendment 3",
        title: "Extend SLA coverage to weekends",
        effectiveDate: "2027-01-01",
        summary:
          "Moves severity 2 response from business hours to 7 days a week. Awaiting vendor signature.",
        valueChange: 24_000,
        approvedBy: "Pending: Procurement committee",
        status: "pending",
      },
      {
        number: "Amendment 2",
        title: "Add building F to scope",
        effectiveDate: "2026-08-12",
        summary:
          "Adds the new logistics annex (building F) to Phase 2 and extends the support scope to match.",
        valueChange: 60_000,
        approvedBy: "Approved by Daniel Okafor, Director of Facilities",
        status: "executed",
      },
      {
        number: "Amendment 1",
        title: "Controller hardware substitution",
        effectiveDate: "2026-05-27",
        summary:
          "Replaces discontinued controller model with the current generation. Warranty extended from 12 to 24 months.",
        valueChange: 180_000,
        approvedBy: "Approved by Daniel Okafor, Director of Facilities",
        status: "executed",
      },
    ],
  },
};
