import type { Metadata } from "next";
import { getActiveOrders } from "@/lib/orders";
import { OrdersBoard } from "@/components/admin/OrdersBoard";

export const metadata: Metadata = {
  title: "Commandes",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  const orders = await getActiveOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Commandes</h1>
      <p className="mt-1 text-sm text-muted">
        Mise à jour automatique toutes les 5 secondes.
      </p>

      <div className="mt-8">
        <OrdersBoard
          orders={orders.map((o) => ({
            id: o.id,
            tableNumber: o.tableNumber,
            status: o.status,
            note: o.note,
            createdAt: o.createdAt.toISOString(),
            items: o.items.map((i) => ({
              name: i.menuItem.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          }))}
        />
      </div>
    </div>
  );
}
