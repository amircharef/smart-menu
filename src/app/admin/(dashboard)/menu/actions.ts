"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categoryFormSchema, menuItemFormSchema } from "@/lib/validations";

export interface ActionState {
  error?: string;
}

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

function parseCategoryForm(formData: FormData) {
  return categoryFormSchema.safeParse({
    name: formData.get("name"),
    order: formData.get("order") || 0,
  });
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Erreur de validation." };
  }
  await db.menuCategory.create({ data: parsed.data });
  revalidateMenu();
  redirect("/admin/menu");
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Erreur de validation." };
  }
  await db.menuCategory.update({ where: { id }, data: parsed.data });
  revalidateMenu();
  redirect("/admin/menu");
}

export async function deleteCategory(id: string) {
  await db.menuCategory.delete({ where: { id } });
  revalidateMenu();
}

function parseMenuItemForm(formData: FormData) {
  return menuItemFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image") || undefined,
    categoryId: formData.get("categoryId"),
    available: formData.get("available") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createMenuItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseMenuItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Erreur de validation." };
  }
  const { available, ...rest } = parsed.data;
  await db.menuItem.create({ data: { ...rest, available: available ?? true } });
  revalidateMenu();
  redirect("/admin/menu");
}

export async function updateMenuItem(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseMenuItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Erreur de validation." };
  }
  const { available, ...rest } = parsed.data;
  await db.menuItem.update({ where: { id }, data: { ...rest, available: available ?? false } });
  revalidateMenu();
  redirect("/admin/menu");
}

export async function deleteMenuItem(id: string) {
  await db.menuItem.delete({ where: { id } });
  revalidateMenu();
}
