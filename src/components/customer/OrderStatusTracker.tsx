"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChefHat, Clock, PartyPopper, XCircle } from "lucide-react";
import { formatDA, cn } from "@/lib/utils";

interface OrderData {
  id: string;
  status: string;
  tableNumber: number;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const steps = [
  { key: "new", label: "Reçue", icon: Clock, waitingText: "Ta commande vient d'arriver en cuisine…" },
  { key: "in_progress", label: "En préparation", icon: ChefHat, waitingText: "Ça mijote en cuisine…" },
  { key: "ready", label: "Prête", icon: CheckCircle2, waitingText: "On arrive à ta table…" },
  { key: "served", label: "Servie", icon: PartyPopper, waitingText: "Bon appétit !" },
];

function WaitingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1 w-1 rounded-full bg-accent"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

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
  const currentStep = steps[currentIndex];
  const isServed = order.status === "served";

  if (order.status === "cancelled") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <XCircle size={40} className="text-status-cancelled" />
        </motion.div>
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
        {isServed ? "Bon appétit !" : "Ta commande arrive"}
      </h1>

      <AnimatePresence mode="wait">
        <motion.p
          key={order.status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-2 flex items-center justify-center gap-1.5 text-center text-sm text-muted"
        >
          {currentStep?.waitingText}
          {!isServed && <WaitingDots />}
        </motion.p>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  {isCurrent && !isServed && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-accent/30"
                      animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <motion.div
                    animate={
                      isCurrent
                        ? { scale: [1, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={
                      isCurrent
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    className={cn(
                      "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-surface text-subtle",
                    )}
                  >
                    <Icon size={16} />
                  </motion.div>
                </div>
                {i < steps.length - 1 && (
                  <div className="relative h-0.5 flex-1 overflow-hidden bg-border">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent"
                      initial={false}
                      animate={{ width: i < currentIndex ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 space-y-3 rounded-2xl border border-border bg-surface p-5"
      >
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
      </motion.div>

      <AnimatePresence>
        {isServed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
            className="mt-6 flex justify-center"
          >
            <motion.span
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl"
            >
              🎉
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
