import type { Metadata } from "next";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { getAllCategories } from "@/lib/menu";
import { createMenuItem } from "../../actions";

export const metadata: Metadata = {
  title: "Nouvel article",
  robots: { index: false, follow: false },
};

export default async function NewMenuItemPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Nouvel article</h1>
      {categories.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Crée d&apos;abord une catégorie avant d&apos;ajouter un article.
        </p>
      ) : (
        <div className="mt-8">
          <MenuItemForm action={createMenuItem} categories={categories} />
        </div>
      )}
    </div>
  );
}
