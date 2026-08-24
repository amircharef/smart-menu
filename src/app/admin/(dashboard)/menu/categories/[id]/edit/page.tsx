import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/menu";
import { updateCategory } from "../../../actions";

export const metadata: Metadata = {
  title: "Modifier la catégorie",
  robots: { index: false, follow: false },
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">
        Modifier « {category.name} »
      </h1>
      <div className="mt-8">
        <CategoryForm action={updateCategory.bind(null, id)} category={category} />
      </div>
    </div>
  );
}
