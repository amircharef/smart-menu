import { db } from "@/lib/db";

export async function getActiveOrders() {
  return db.order.findMany({
    where: { status: { in: ["new", "in_progress", "ready"] } },
    orderBy: { createdAt: "asc" },
    include: { items: { include: { menuItem: true } } },
  });
}

export async function getOrderHistory(limit = 50) {
  return db.order.findMany({
    where: { status: { in: ["served", "cancelled"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { items: { include: { menuItem: true } } },
  });
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } } },
  });
}

export function orderTotal(items: { quantity: number; unitPrice: number }[]) {
  return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}

export async function getTodayStats() {
  const since = new Date();
  since.setHours(0, 0, 0, 0);

  const todaysOrders = await db.order.findMany({
    where: { createdAt: { gte: since }, status: { not: "cancelled" } },
    include: { items: true },
  });

  const revenue = todaysOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    0,
  );

  return { orderCount: todaysOrders.length, revenue };
}
