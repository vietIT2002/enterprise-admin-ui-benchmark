import type { Metadata } from "next"
import { EmployeeForm } from "./_components/employee-form"

export const metadata: Metadata = { title: "New employee" }

export default async function NewEmployeePage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams
  const mode = state === "loading" || state === "error" || state === "empty" ? state : undefined
  return <EmployeeForm state={mode} />
}
