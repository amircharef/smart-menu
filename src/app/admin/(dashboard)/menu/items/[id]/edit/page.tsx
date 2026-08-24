import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { getMenuItemById, getAllCategories } from "@/lib/menu";
import { updateMenuItem } from "../../../actions";

export const metadata: Metadata = {
  title: "Modifier l'article",
  robots: { index: false, follow: false },
};

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories] = await Promise.all([getMenuItemById(id), getAllCategories()]);
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Modifier « {item.name} »</h1>
      <div className="mt-8">
        <MenuItemForm action={updateMenuItem.bind(null, id)} item={item} categories={categories} />
      </div>
    </div>
  );
}
