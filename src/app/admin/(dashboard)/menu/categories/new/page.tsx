import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "../../actions";

export const metadata: Metadata = {
  title: "Nouvelle catégorie",
  robots: { index: false, follow: false },
};

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Nouvelle catégorie</h1>
      <div className="mt-8">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
