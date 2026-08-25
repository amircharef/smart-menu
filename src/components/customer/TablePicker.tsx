"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

const QUICK_TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

export function TablePicker() {
  const router = useRouter();
  const [customValue, setCustomValue] = useState("");

  function goToTable(n: number) {
    if (!Number.isInteger(n) || n < 1) return;
    router.push(`/t/${n}`);
  }

  function onCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToTable(Number(customValue));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white">
          <UtensilsCrossed size={26} />
        </div>
        <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Quelle est ta table ?
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Le numéro est indiqué sur ta table. Touche-le pour accéder au menu.
        </p>
      </motion.div>

      <div className="mt-10 grid w-full max-w-sm grid-cols-4 gap-3">
        {QUICK_TABLES.map((n, i) => (
          <motion.button
            key={n}
            onClick={() => goToTable(n)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.035, ease: "easeOut" }}
            whileTap={{ scale: 0.92 }}
            className="font-display flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface text-xl font-semibold text-foreground shadow-sm transition-colors hover:border-accent/50 hover:text-accent active:bg-surface-hover"
          >
            {n}
          </motion.button>
        ))}
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        onSubmit={onCustomSubmit}
        className="mt-8 flex w-full max-w-sm items-center gap-2"
      >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Autre numéro de table"
          className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          disabled={!customValue}
          aria-label="Valider"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform disabled:opacity-40 not-disabled:hover:scale-105 not-disabled:active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
      </motion.form>
    </main>
  );
}
