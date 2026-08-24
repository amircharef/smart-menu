import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { OrderStatusTracker } from "@/components/customer/OrderStatusTracker";

export const metadata: Metadata = {
  title: "Suivi de commande",
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <OrderStatusTracker
      initialOrder={{
        id: order.id,
        status: order.status,
        tableNumber: order.tableNumber,
        items: order.items.map((i) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      }}
    />
  );
}
