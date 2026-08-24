import Link from "next/link";
import type { Metadata } from "next";
import { Plus, EyeOff } from "lucide-react";
import { getAllCategoriesAdmin } from "@/lib/menu";
import { deleteCategory, deleteMenuItem } from "./actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Menu",
  robots: { index: false, follow: false },
};

export default async function AdminMenuPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Menu</h1>
          <p className="mt-1 text-sm text-muted">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/menu/categories/new"
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:text-foreground"
          >
            + Catégorie
          </Link>
          <Link
            href="/admin/menu/items/new"
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white"
          >
            <Plus size={14} />
            Nouvel article
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {categories.length === 0 && (
          <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-subtle">
            Aucune catégorie pour l&apos;instant.
          </p>
        )}

        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{category.name}</h2>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/menu/categories/${category.id}/edit`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
                >
                  Modifier
                </Link>
                <DeleteButton
                  action={deleteCategory.bind(null, category.id)}
                  confirmMessage={`Supprimer la catégorie "${category.name}" et tous ses articles ?`}
                />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {category.items.length === 0 && (
                <p className="text-xs text-subtle">Aucun article dans cette catégorie.</p>
              )}
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium">{item.name}</h3>
                      {!item.available && (
                        <span className="flex items-center gap-1 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] text-subtle">
                          <EyeOff size={10} />
                          masqué
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-subtle">{formatDA(item.price)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/menu/items/${item.id}/edit`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deleteMenuItem.bind(null, item.id)}
                      confirmMessage={`Supprimer l'article "${item.name}" ?`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
