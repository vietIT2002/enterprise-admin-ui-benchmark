export type Option = { value: string; label: string }

const opts = (items: string[]): Option[] => items.map((v) => ({ value: v, label: v }))

export const GENDERS = opts(["Female", "Male", "Not specified"])
export const NATIONALITIES = opts(["Vietnamese", "Korean", "Japanese", "American", "Other"])
export const CITIES = opts(["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Other province"])
export const DEPARTMENTS = opts(["Engineering", "Finance & Accounting", "Human Resources", "Operations", "Sales", "Customer Support"])
export const LOCATIONS = opts(["Hà Nội HQ – 18 Duy Tân, Cầu Giấy", "TP.HCM – 72 Lê Thánh Tôn, Quận 1", "Đà Nẵng – 45 Nguyễn Văn Linh", "Remote"])
export const EMPLOYMENT_TYPES = opts(["Full-time", "Part-time", "Intern"])
export const CONTRACT_TYPES = opts(["Probation (2 months)", "Fixed-term (12 months)", "Fixed-term (36 months)", "Indefinite"])
export const RELATIONSHIPS = opts(["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"])
export const BANKS = opts(["Vietcombank", "Techcombank", "BIDV", "VietinBank", "MB Bank", "ACB", "VPBank", "Sacombank"])

export const MANAGERS: Option[] = [
  { value: "NV-2021-0012", label: "Trần Minh Quân – Head of Engineering (NV-2021-0012)" },
  { value: "NV-2022-0034", label: "Lê Thu Hà – Finance manager (NV-2022-0034)" },
  { value: "NV-2020-0007", label: "Phạm Quốc Bảo – Operations manager (NV-2020-0007)" },
  { value: "NV-2023-0061", label: "Đỗ Khánh Linh – Sales lead (NV-2023-0061)" },
  { value: "NV-2022-0049", label: "Vũ Thị Mai – HR business partner (NV-2022-0049)" },
]

export const OFFER = {
  id: "OFF-2026-0412",
  acceptedOn: "28/10/2026",
  recruiter: "Vũ Thị Mai",
}

export const NEXT_EMPLOYEE_ID = "NV-2026-0143"

/** An ID number that the mock server reports as already registered. */
export const DUPLICATE_ID_NUMBER = "079190004521"
export const DUPLICATE_OWNER = "Phạm Quốc Bảo (NV-2020-0007)"

export type DocSlot = { key: string; label: string; required: boolean; hint: string }

export const DOC_SLOTS: DocSlot[] = [
  { key: "idCopy", label: "ID card copy (both sides)", required: true, hint: "PDF or image, up to 5 MB" },
  { key: "photo", label: "Portrait photo 3×4", required: true, hint: "JPG or PNG, up to 2 MB" },
  { key: "degree", label: "Degree or certificate", required: false, hint: "PDF, up to 10 MB" },
  { key: "health", label: "Health check certificate", required: false, hint: "PDF, issued in the last 6 months" },
  { key: "bankLetter", label: "Bank account confirmation", required: false, hint: "PDF or image" },
  { key: "signedContract", label: "Signed labour contract", required: false, hint: "Uploaded after the signing meeting" },
]

export type FieldKey =
  | "fullName" | "dob" | "gender" | "nationality" | "idNumber" | "personalEmail" | "mobile" | "address" | "city"
  | "jobTitle" | "department" | "manager" | "location" | "employmentType" | "contractType" | "startDate" | "probationEnd" | "salary"
  | "bank" | "accountNumber" | "accountHolder" | "taxCode" | "insuranceNumber"
  | "ecName" | "ecRelationship" | "ecPhone" | "ecEmail"

export type Values = Record<FieldKey, string>

export const INITIAL: Values = {
  // Prefilled from the accepted offer
  fullName: "Nguyễn Hoàng Nam",
  personalEmail: "nam.nguyen.hoang@gmail.com",
  jobTitle: "Backend engineer",
  department: "Engineering",
  startDate: "2026-11-16",
  salary: "32000000",
  contractType: "Probation (2 months)",
  employmentType: "Full-time",
  // To be filled in by HR
  dob: "", gender: "", nationality: "Vietnamese", idNumber: "", mobile: "", address: "", city: "",
  manager: "", location: "", probationEnd: "2027-01-15",
  bank: "", accountNumber: "", accountHolder: "", taxCode: "", insuranceNumber: "",
  ecName: "", ecRelationship: "", ecPhone: "", ecEmail: "",
}

export type UploadedDoc = { name: string; size: number }
export type Docs = Record<string, UploadedDoc | undefined>
