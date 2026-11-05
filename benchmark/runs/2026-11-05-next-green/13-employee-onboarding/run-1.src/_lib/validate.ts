import type { Docs, FieldKey, Values } from "./data"
import { DOC_SLOTS } from "./data"

export type Errors = Partial<Record<FieldKey | "docs", string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^(\+84|0)\d{9}$/

/** Label used in the error summary. */
export const LABELS: Record<FieldKey, string> = {
  fullName: "Full name", dob: "Date of birth", gender: "Gender", nationality: "Nationality",
  idNumber: "ID number", personalEmail: "Personal email", mobile: "Mobile phone", address: "Street address", city: "City or province",
  jobTitle: "Job title", department: "Department", manager: "Reports to", location: "Work location",
  employmentType: "Employment type", contractType: "Contract type", startDate: "Start date",
  probationEnd: "Probation end date", salary: "Monthly gross salary",
  bank: "Bank", accountNumber: "Account number", accountHolder: "Account holder", taxCode: "Personal tax code", insuranceNumber: "Social insurance number",
  ecName: "Contact name", ecRelationship: "Relationship", ecPhone: "Contact phone", ecEmail: "Contact email",
}

export const ORDER: FieldKey[] = [
  "fullName", "dob", "gender", "nationality", "idNumber", "personalEmail", "mobile", "address", "city",
  "jobTitle", "department", "manager", "location", "employmentType", "contractType", "startDate", "probationEnd", "salary",
  "bank", "accountNumber", "accountHolder", "taxCode", "insuranceNumber",
  "ecName", "ecRelationship", "ecPhone", "ecEmail",
]

const REQUIRED: Partial<Record<FieldKey, string>> = {
  fullName: "Enter the full name of the employee",
  dob: "Enter the date of birth",
  idNumber: "Enter the 12-digit ID number",
  personalEmail: "Enter an email like name@gmail.com",
  mobile: "Enter a phone like 0903 123 456",
  address: "Enter the street address",
  city: "Choose a city or province",
  jobTitle: "Enter the job title",
  department: "Choose a department",
  employmentType: "Choose an employment type",
  contractType: "Choose a contract type",
  startDate: "Enter the first working day",
  salary: "Enter the monthly gross salary in VND",
  bank: "Choose a bank",
  accountNumber: "Enter the account number",
  accountHolder: "Enter the account holder name",
  ecName: "Enter the name of the contact",
  ecRelationship: "Choose the relationship",
  ecPhone: "Enter a phone like 0903 123 456",
}

/** Validates one field. With strict = false (draft) only values that were typed are checked. */
export function validateField(key: FieldKey, v: Values, strict = true): string | undefined {
  const value = v[key].trim()
  if (!value) return strict ? REQUIRED[key] : undefined
  switch (key) {
    case "dob": {
      const age = (Date.parse("2026-11-05") - Date.parse(value)) / (365.25 * 864e5)
      if (Number.isNaN(age) || age < 16 || age > 70) return "Enter a date of birth that makes the employee 16 to 70 years old"
      return
    }
    case "idNumber":
      return /^\d{12}$/.test(value) ? undefined : "Enter exactly 12 digits, no spaces"
    case "personalEmail":
    case "ecEmail":
      return EMAIL.test(value) ? undefined : "Enter an email like name@gmail.com"
    case "mobile":
    case "ecPhone":
      return PHONE.test(value.replace(/[\s.]/g, "")) ? undefined : "Enter a phone like 0903 123 456 or +84 903 123 456"
    case "salary":
      return Number(value) >= 5_000_000 ? undefined : "Enter at least 5.000.000 VND"
    case "probationEnd":
      if (v.startDate && value <= v.startDate) return "Choose a date after the start date"
      return
    case "accountNumber":
      return /^\d{8,16}$/.test(value) ? undefined : "Enter 8 to 16 digits, no spaces"
    case "taxCode":
    case "insuranceNumber":
      return /^\d{10}$/.test(value) ? undefined : "Enter 10 digits"
    default:
      return
  }
}

export function validateAll(v: Values, docs: Docs, strict: boolean): Errors {
  const errors: Errors = {}
  for (const key of ORDER) {
    const message = validateField(key, v, strict)
    if (message) errors[key] = message
  }
  if (strict) {
    const missing = DOC_SLOTS.filter((s) => s.required && !docs[s.key]).map((s) => s.label)
    if (missing.length) errors.docs = `Upload the required documents: ${missing.join(", ")}`
  }
  return errors
}
