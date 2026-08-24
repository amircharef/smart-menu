import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { placeOrderSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = placeOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Commande invalide." },
      { status: 400 },
    );
  }

  const { tableNumber, note, items } = parsed.data;

  const menuItems = await db.menuItem.findMany({
    where: { id: { in: items.map((i) => i.menuItemId) }, available: true },
  });

  if (menuItems.length !== items.length) {
    return NextResponse.json(
      { error: "Un ou plusieurs articles ne sont plus disponibles." },
      { status: 409 },
    );
  }

  const priceById = new Map(menuItems.map((m) => [m.id, m.price]));

  const order = await db.order.create({
    data: {
      tableNumber,
      note,
      items: {
        create: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          unitPrice: priceById.get(i.menuItemId)!,
        })),
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
