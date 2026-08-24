import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuForCustomers } from "@/lib/menu";
import { MenuBrowser } from "@/components/customer/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu",
};

export default async function TableMenuPage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber: raw } = await params;
  const tableNumber = Number(raw);
  if (!Number.isInteger(tableNumber) || tableNumber < 1) notFound();

  const categories = await getMenuForCustomers();

  return <MenuBrowser categories={categories} tableNumber={tableNumber} />;
}
