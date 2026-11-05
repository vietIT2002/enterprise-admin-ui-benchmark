import { Suspense } from "react"
import type { Metadata } from "next"
import { EquipmentList } from "./_components/equipment-list"
import { ListSkeleton } from "./_components/list-skeleton"

export const metadata: Metadata = {
  title: "Equipment",
}

export default function EquipmentPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] p-6">
      <Suspense fallback={<ListSkeleton />}>
        <EquipmentList />
      </Suspense>
    </main>
  )
}
