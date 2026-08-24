"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChefHat, Clock, PartyPopper, XCircle } from "lucide-react";
import { formatDA, cn } from "@/lib/utils";

interface OrderData {
  id: string;
  status: string;
  tableNumber: number;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const steps = [
  { key: "new", label: "Reçue", icon: Clock },
  { key: "in_progress", label: "En préparation", icon: ChefHat },
  { key: "ready", label: "Prête", icon: CheckCircle2 },
  { key: "served", label: "Servie", icon: PartyPopper },
];

export function OrderStatusTracker({ initialOrder }: { initialOrder: OrderData }) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (order.status === "served" || order.status === "cancelled") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) setOrder(await res.json());
    }, 5000);
    return () => clearInterval(interval);
  }, [order.id, order.status]);

  const total = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const currentIndex = steps.findIndex((s) => s.key === order.status);

  if (order.status === "cancelled") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <XCircle size={40} className="text-status-cancelled" />
        <h1 className="font-display mt-4 text-xl font-semibold">Commande annulée</h1>
        <p className="mt-2 text-sm text-muted">
          Cette commande a été annulée. Contacte le staff si besoin.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-10">
      <p className="text-center font-mono text-xs text-subtle uppercase">
        Table {order.tableNumber} · Commande #{order.id.slice(-6)}
      </p>
      <h1 className="font-display mt-2 text-center text-2xl font-semibold">
        {order.status === "served" ? "Bon appétit !" : "Ta commande arrive"}
      </h1>

      <div className="mt-10 flex items-center justify-between">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = i <= currentIndex;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-subtle",
                  )}
                >
                  <Icon size={16} />
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors",
                      i < currentIndex ? "bg-accent" : "bg-border",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-center text-[11px] font-medium",
                  active ? "text-foreground" : "text-subtle",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-10 space-y-3 rounded-2xl border border-border bg-surface p-5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {item.quantity} × {item.name}
            </span>
            <span className="font-medium">{formatDA(item.quantity * item.unitPrice)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
          <span>Total</span>
          <span className="font-display">{formatDA(total)}</span>
        </div>
      </div>
    </main>
  );
}
