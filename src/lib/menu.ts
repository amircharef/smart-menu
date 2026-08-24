import { db } from "@/lib/db";

export async function getMenuForCustomers() {
  const categories = await db.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return categories.filter((c) => c.items.length > 0);
}

export async function getAllCategoriesAdmin() {
  return db.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });
}

export async function getAllCategories() {
  return db.menuCategory.findMany({ orderBy: { order: "asc" } });
}

export async function getCategoryById(id: string) {
  return db.menuCategory.findUnique({ where: { id } });
}

export async function getMenuItemById(id: string) {
  return db.menuItem.findUnique({ where: { id } });
}
