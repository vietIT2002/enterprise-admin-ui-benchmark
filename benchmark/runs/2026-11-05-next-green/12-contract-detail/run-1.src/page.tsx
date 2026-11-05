import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContractView } from "./_components/contract-view";
import { findContract } from "./_lib/contract-data";

export const metadata: Metadata = { title: "Contract HĐ-2026-0187" };

export default async function ContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; state?: string }>;
}) {
  const { id } = await params;
  const { tab, state } = await searchParams;
  const contract = findContract(id);
  if (!contract) notFound();
  return <ContractView contract={contract} initialTab={tab} state={state} />;
}
