"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/enums";

const validStatuses: OrderStatus[] = ["new", "in_progress", "ready", "served", "cancelled"];

export async function updateOrderStatus(id: string, status: string) {
  if (!validStatuses.includes(status as OrderStatus)) return;
  await db.order.update({ where: { id }, data: { status: status as OrderStatus } });
  revalidatePath("/admin/orders");
}
