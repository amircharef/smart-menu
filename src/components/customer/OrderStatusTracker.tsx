"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChefHat, Clock, PartyPopper, XCircle, Bell } from "lucide-react";
import { formatDA, cn } from "@/lib/utils";

interface OrderData {
  id: string;
  status: string;
  tableNumber: number;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const steps = [
  {
    key: "new",
    label: "Reçue",
    icon: Clock,
    color: "var(--status-new)",
    heroTitle: "Commande reçue",
    waitingText: "Ta commande vient d'arriver en cuisine",
  },
  {
    key: "in_progress",
    label: "En préparation",
    icon: ChefHat,
    color: "var(--accent)",
    heroTitle: "En préparation",
    waitingText: "Ça mijote en cuisine",
  },
  {
    key: "ready",
    label: "Prête",
    icon: CheckCircle2,
    color: "var(--accent-green)",
    heroTitle: "C'est prêt !",
    waitingText: "On arrive à ta table",
  },
  {
    key: "served",
    label: "Servie",
    icon: PartyPopper,
    color: "var(--accent-green)",
    heroTitle: "Bon appétit !",
    waitingText: "Régale-toi bien",
  },
];

function WaitingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1 w-1 rounded-full bg-current"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function elapsedLabel(createdAt: string, now: number) {
  const mins = Math.max(0, Math.round((now - new Date(createdAt).getTime()) / 60000));
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `il y a ${h}h${m > 0 ? String(m).padStart(2, "0") : ""}`;
}

export function OrderStatusTracker({ initialOrder }: { initialOrder: OrderData }) {
  const [order, setOrder] = useState(initialOrder);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (order.status === "served" || order.status === "cancelled") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) setOrder(await res.json());
    }, 5000);
    return () => clearInterval(interval);
  }, [order.id, order.status]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);

  const total = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const currentIndex = steps.findIndex((s) => s.key === order.status);
  const currentStep = steps[currentIndex];
  const isServed = order.status === "served";
  const isActive = !isServed && order.status !== "cancelled";

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
    <main className="relative mx-auto min-h-screen max-w-md overflow-hidden px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-[0.15] blur-3xl transition-colors duration-700"
        style={{ background: currentStep?.color }}
      />

      <div className="relative">
        <p className="text-center font-mono text-xs text-subtle uppercase">
          Table {order.tableNumber} · Commande #{order.id.slice(-6)}
        </p>

        <div className="mt-1.5 flex justify-center">
          <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-subtle">
            Commandée {elapsedLabel(order.createdAt, now)}
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            {isActive && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: currentStep?.color }}
                  animate={{ scale: [1, 1.6], opacity: [0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: currentStep?.color }}
                  animate={{ scale: [1, 1.6], opacity: [0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                />
              </>
            )}
            <motion.div
              key={order.status}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: isActive ? [1, 1.06, 1] : 1,
                opacity: 1,
              }}
              transition={
                isActive
                  ? { scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }
                  : { type: "spring", stiffness: 260, damping: 18 }
              }
              className="relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg"
              style={{ background: currentStep?.color, boxShadow: `0 12px 28px -8px ${currentStep?.color}` }}
            >
              {currentStep && <currentStep.icon size={40} />}
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={order.status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-5 text-center"
          >
            <h1 className="font-display text-2xl font-semibold">{currentStep?.heroTitle}</h1>
            <p
              className="mt-1.5 flex items-center justify-center gap-1.5 text-sm"
              style={{ color: currentStep?.color }}
            >
              {currentStep?.waitingText}
              {isActive && <WaitingDots />}
              {isServed && <span>🎉</span>}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mx-auto mt-9 flex max-w-xs items-center gap-1.5">
          {steps.map((step, i) => (
            <div key={step.key} className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: step.color }}
                  initial={false}
                  animate={{ width: i <= currentIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.08 }}
                />
              </div>
              <p
                className={cn(
                  "mt-1.5 text-center text-[10px] font-medium leading-tight",
                  i <= currentIndex ? "text-foreground" : "text-subtle",
                )}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-9 space-y-3 rounded-2xl border border-border bg-surface p-5"
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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-border p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Bell size={15} />
          </div>
          <p className="text-xs text-muted">
            Besoin de quelque chose ? Fais simplement signe à un membre de l&apos;équipe, on est
            juste à côté.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
