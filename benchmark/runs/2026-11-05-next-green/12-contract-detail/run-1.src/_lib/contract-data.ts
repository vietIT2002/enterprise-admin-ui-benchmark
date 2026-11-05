import { TODAY, daysBetween } from "./format";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string; // display form
  tel: string; // E.164
  primary?: boolean;
};

export type Milestone = {
  no: number;
  name: string;
  due: string; // YYYY-MM-DD
  share: number; // ratio
  amount: number; // VND
  paidOn?: string;
  invoice?: string;
};

export type Amendment = {
  no: string;
  effective: string;
  summary: string;
  valueChange: number;
  status: "Approved" | "Pending approval";
  approvedBy?: string;
  approvedOn?: string;
  waitingFor?: string;
};

export type HistoryEvent = {
  at: string; // ISO instant
  who: string;
  what: string;
  detail: string;
};

export type Attachment = { name: string; type: string; sizeMb: number; canPreview: boolean };

export type RenewalStep = { name: string; note: string; label: string; tone: Tone };

export type Contract = {
  id: string;
  title: string;
  vendor: {
    name: string;
    taxCode: string;
    address: string;
    website: string;
  };
  department: string;
  owner: string;
  type: string;
  signedOn: string;
  start: string;
  end: string;
  originalValue: number;
  currentValue: number;
  paymentTerms: string;
  lateFee: string;
  retention: string;
  priceBasis: string;
  sla: string;
  liabilityCap: string;
  terminationNotice: string;
  governingLaw: string;
  confidentiality: string;
  lastChangedBy: string;
  lastChangedAt: string;
  contacts: Contact[];
  milestones: Milestone[];
  amendments: Amendment[];
  attachments: Attachment[];
  history: HistoryEvent[];
  renewal: {
    autoRenew: boolean;
    termMonths: number;
    noticeDays: number;
    noticeDeadline: string;
    proposedChange: string;
    previousContract: string;
    steps: RenewalStep[];
  };
};

export const CONTRACT: Contract = {
  id: "HĐ-2026-0187",
  title: "IT infrastructure maintenance and support 2026–2027",
  vendor: {
    name: "Công ty TNHH Giải pháp Hạ tầng Minh Phát",
    taxCode: "0312345678",
    address: "126 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
    website: "https://minhphat-infra.example.vn",
  },
  department: "Information technology",
  owner: "Phạm Quốc Bảo",
  type: "Service agreement",
  signedOn: "2026-02-20",
  start: "2026-03-01",
  end: "2027-02-28",
  originalValue: 4_500_000_000,
  currentValue: 4_800_000_000,
  paymentTerms: "Net 30 from invoice date",
  lateFee: "0,05% of the overdue amount per day",
  retention: "10% held until final acceptance",
  priceBasis: "Fixed price, VAT excluded",
  sla: "Critical incidents: response within 2 hours, resolution within 8 hours; 99,5% monthly availability",
  liabilityCap: "100% of the annual contract value",
  terminationNotice: "60 days in writing",
  governingLaw: "Laws of Vietnam; disputes go to VIAC, Ho Chi Minh City",
  confidentiality: "5 years after the contract ends",
  lastChangedBy: "Lê Thu Hà",
  lastChangedAt: "2026-10-28T07:20:00Z",
  contacts: [
    { id: "c1", name: "Nguyễn Hoàng Long", role: "Account manager", email: "long.nguyen@minhphat-infra.example.vn", phone: "0903 123 456", tel: "+84903123456", primary: true },
    { id: "c2", name: "Trần Thị Ngọc Anh", role: "Finance and invoicing", email: "anh.tran@minhphat-infra.example.vn", phone: "0912 345 678", tel: "+84912345678" },
    { id: "c3", name: "Đặng Văn Khôi", role: "Service desk lead", email: "khoi.dang@minhphat-infra.example.vn", phone: "0938 765 432", tel: "+84938765432" },
    { id: "c4", name: "Võ Minh Châu", role: "Legal counsel", email: "chau.vo@minhphat-infra.example.vn", phone: "0977 210 987", tel: "+84977210987" },
  ],
  milestones: [
    { no: 1, name: "Advance payment", due: "2026-03-15", share: 0.2, amount: 960_000_000, paidOn: "2026-03-12", invoice: "MP-0412" },
    { no: 2, name: "Q2 service fee", due: "2026-06-30", share: 0.25, amount: 1_200_000_000, paidOn: "2026-06-26", invoice: "MP-0587" },
    { no: 3, name: "Q3 service fee", due: "2026-09-30", share: 0.25, amount: 1_200_000_000, invoice: "MP-0731" },
    { no: 4, name: "Q4 service fee", due: "2026-11-15", share: 0.2, amount: 960_000_000 },
    { no: 5, name: "Final acceptance", due: "2027-02-28", share: 0.1, amount: 480_000_000 },
  ],
  amendments: [
    { no: "PL-01", effective: "2026-06-01", summary: "Response time for critical incidents shortened from 4 hours to 2 hours", valueChange: 0, status: "Approved", approvedBy: "Lê Thu Hà", approvedOn: "2026-05-18" },
    { no: "PL-02", effective: "2026-09-01", summary: "Add the Hải Phòng data centre to the covered sites", valueChange: 300_000_000, status: "Approved", approvedBy: "Trần Minh Quân", approvedOn: "2026-08-28" },
    { no: "PL-03", effective: "2026-12-01", summary: "Price indexation of 4% for the renewal term, 24x7 on-site support added", valueChange: 192_000_000, status: "Pending approval", waitingFor: "Trần Minh Quân (Finance manager)" },
  ],
  attachments: [
    { name: "HD-2026-0187-signed.pdf", type: "PDF", sizeMb: 2.4, canPreview: true },
    { name: "PL-02-hai-phong-site.pdf", type: "PDF", sizeMb: 0.6, canPreview: true },
    { name: "SLA-schedule-v3.docx", type: "DOCX", sizeMb: 0.3, canPreview: false },
  ],
  history: [
    { at: "2026-10-28T07:20:00Z", who: "Lê Thu Hà", what: "Amendment PL-03 submitted", detail: "Status: (empty) → Pending approval" },
    { at: "2026-10-20T03:05:00Z", who: "Phạm Quốc Bảo", what: "Updated 1 field", detail: "Renewal owner: (empty) → Phạm Quốc Bảo" },
    { at: "2026-09-02T02:40:00Z", who: "System", what: "Value changed by amendment PL-02", detail: "Contract value: 4.500.000.000 ₫ → 4.800.000.000 ₫" },
    { at: "2026-08-28T09:12:00Z", who: "Trần Minh Quân", what: "Amendment PL-02 approved", detail: "Status: Pending approval → Approved" },
    { at: "2026-05-18T08:30:00Z", who: "Lê Thu Hà", what: "Amendment PL-01 approved", detail: "Status: Pending approval → Approved" },
    { at: "2026-03-01T01:00:00Z", who: "Phạm Quốc Bảo", what: "Created", detail: "Contract HĐ-2026-0187 created from the signed PDF" },
  ],
  renewal: {
    autoRenew: false,
    termMonths: 12,
    noticeDays: 90,
    noticeDeadline: "2026-11-30",
    proposedChange: "Vendor proposes +4% on the annual fee and 24x7 on-site support (amendment PL-03)",
    previousContract: "HĐ-2025-0112 (03/2025 – 02/2026)",
    steps: [
      { name: "Vendor performance review", note: "Completed by Phạm Quốc Bảo on 20/10/2026", label: "Done", tone: "success" },
      { name: "Renewal proposal from vendor", note: "Received 28/10/2026 as amendment PL-03", label: "Done", tone: "success" },
      { name: "Internal approval", note: "Waiting for Trần Minh Quân (Finance manager)", label: "In approval", tone: "info" },
      { name: "Send renewal notice to vendor", note: "Written notice due by 30/11/2026", label: "Due in 25 days", tone: "warning" },
      { name: "Contract expires", note: "28/02/2027", label: "Not started", tone: "neutral" },
    ],
  },
};

const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

export function findContract(id: string): Contract | null {
  return fold(decodeURIComponent(id)) === fold(CONTRACT.id) ? CONTRACT : null;
}

export type MilestoneStatus = { label: string; tone: Tone; rank: number };

export function milestoneStatus(m: Milestone): MilestoneStatus {
  if (m.paidOn) return { label: "Paid", tone: "success", rank: 2 };
  const d = daysBetween(TODAY, m.due);
  if (d < 0) return { label: `Overdue ${-d} days`, tone: "danger", rank: 0 };
  if (d <= 30) return { label: d === 0 ? "Due today" : `Due in ${d} days`, tone: "warning", rank: 1 };
  return { label: "Scheduled", tone: "neutral", rank: 2 };
}

/** Overdue first, then due soon, then the rest; each group by due date. */
export function sortMilestones(list: Milestone[]) {
  return [...list].sort(
    (a, b) => milestoneStatus(a).rank - milestoneStatus(b).rank || a.due.localeCompare(b.due),
  );
}

/** Pending approvals first, then newest effective date. */
export function sortAmendments(list: Amendment[]) {
  return [...list].sort(
    (a, b) =>
      Number(b.status === "Pending approval") - Number(a.status === "Pending approval") ||
      b.effective.localeCompare(a.effective),
  );
}
