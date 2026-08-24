"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChefHat, CheckCircle2, X } from "lucide-react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import { formatDA, cn } from "@/lib/utils";

interface OrderData {
  id: string;
  tableNumber: number;
  status: string;
  note: string | null;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const columns = [
  { key: "new", label: "Nouveau", icon: Clock, nextStatus: "in_progress", nextLabel: "Démarrer" },
  {
    key: "in_progress",
    label: "En préparation",
    icon: ChefHat,
    nextStatus: "ready",
    nextLabel: "Marquer prêt",
  },
  {
    key: "ready",
    label: "Prêt",
    icon: CheckCircle2,
    nextStatus: "served",
    nextLabel: "Marquer servi",
  },
] as const;

function elapsedMinutes(createdAt: string) {
  return Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
}

export function OrdersBoard({ orders }: { orders: OrderData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => router.refresh(), 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  function advance(id: string, status: string) {
    startTransition(() => updateOrderStatus(id, status));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {columns.map((col) => {
        const Icon = col.icon;
        const colOrders = orders.filter((o) => o.status === col.key);
        return (
          <div key={col.key}>
            <div className="mb-3 flex items-center gap-2">
              <Icon size={16} className="text-accent" />
              <h2 className="font-display text-sm font-semibold">{col.label}</h2>
              <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-subtle">
                {colOrders.length}
              </span>
            </div>

            <div className="space-y-3">
              {colOrders.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-subtle">
                  Rien ici
                </p>
              )}

              {colOrders.map((order) => {
                const total = order.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold">Table {order.tableNumber}</span>
                      <span className="font-mono text-xs text-subtle">
                        {elapsedMinutes(order.createdAt)} min
                      </span>
                    </div>

                    <ul className="mt-2 space-y-0.5 text-sm text-muted">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.quantity} × {item.name}
                        </li>
                      ))}
                    </ul>

                    {order.note && (
                      <p className="mt-2 rounded-lg bg-background px-3 py-2 text-xs text-muted italic">
                        &laquo; {order.note} &raquo;
                      </p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-accent-dark">{formatDA(total)}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => advance(order.id, col.nextStatus)}
                        disabled={isPending}
                        className={cn(
                          "flex-1 rounded-full bg-accent px-3 py-2 text-xs font-medium text-white transition-transform disabled:opacity-50",
                          !isPending && "hover:scale-[1.02] active:scale-[0.98]",
                        )}
                      >
                        {col.nextLabel}
                      </button>
                      <button
                        onClick={() => advance(order.id, "cancelled")}
                        disabled={isPending}
                        aria-label="Annuler"
                        className="rounded-full border border-border p-2 text-subtle hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
