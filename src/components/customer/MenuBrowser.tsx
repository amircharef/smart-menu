"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, X, Loader2, UtensilsCrossed } from "lucide-react";
import { formatDA, cn } from "@/lib/utils";

interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

interface CategoryData {
  id: string;
  name: string;
  items: MenuItemData[];
}

export function MenuBrowser({
  categories,
  tableNumber,
}: {
  categories: CategoryData[];
  tableNumber: number;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allItems = useMemo(
    () => new Map(categories.flatMap((c) => c.items).map((i) => [i.id, i])),
    [categories],
  );

  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const itemCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = cartEntries.reduce((sum, [id, qty]) => sum + (allItems.get(id)?.price ?? 0) * qty, 0);

  function setQuantity(id: string, qty: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(20, qty)) }));
  }

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          note: note || undefined,
          items: cartEntries.map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Impossible de contacter le serveur.");
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={20} className="text-accent" />
            <span className="font-display text-lg font-semibold">Smart Menu</span>
          </div>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            Table {tableNumber}
          </span>
        </div>

        {categories.length > 1 && (
          <nav className="scrollbar-none mx-auto flex max-w-2xl gap-2 overflow-x-auto px-5 pb-3">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted hover:border-accent/40 hover:text-accent"
              >
                {c.name}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {categories.length === 0 && (
          <p className="mt-16 text-center text-sm text-subtle">
            Le menu n&apos;est pas disponible pour le moment.
          </p>
        )}

        {categories.map((category) => (
          <section key={category.id} id={`cat-${category.id}`} className="mb-10 scroll-mt-32">
            <h2 className="font-display mb-4 text-xl font-semibold">{category.name}</h2>
            <div className="space-y-3">
              {category.items.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex min-w-0 gap-4">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                        <p className="mt-2 font-display text-sm font-semibold text-accent-dark">
                          {formatDA(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {qty === 0 ? (
                        <button
                          onClick={() => setQuantity(item.id, 1)}
                          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95"
                        >
                          Ajouter
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-1 py-1">
                          <button
                            onClick={() => setQuantity(item.id, qty - 1)}
                            aria-label="Retirer"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-accent hover:bg-surface-hover"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                          <button
                            onClick={() => setQuantity(item.id, qty + 1)}
                            aria-label="Ajouter"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-accent hover:bg-surface-hover"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {itemCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-5 bottom-5 z-20 mx-auto flex max-w-2xl items-center justify-between rounded-full bg-accent px-6 py-4 text-white shadow-lg shadow-accent/30 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingBag size={18} />
            {itemCount} article{itemCount > 1 ? "s" : ""}
          </span>
          <span className="font-display font-semibold">{formatDA(total)}</span>
        </button>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-t-3xl bg-background p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Votre commande</h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Fermer"
                className="rounded-full p-1.5 text-muted hover:bg-surface-hover"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[40vh] space-y-3 overflow-y-auto">
              {cartEntries.map(([id, qty]) => {
                const item = allItems.get(id);
                if (!item) return null;
                return (
                  <div key={id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-subtle">{formatDA(item.price)} × {qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(id, qty - 1)}
                        aria-label="Retirer"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-accent hover:bg-surface-hover"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center font-semibold">{qty}</span>
                      <button
                        onClick={() => setQuantity(id, qty + 1)}
                        aria-label="Ajouter"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-accent hover:bg-surface-hover"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Une remarque pour la cuisine ? (optionnel)"
              className="mt-4 w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              rows={2}
            />

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-lg font-semibold">{formatDA(total)}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={submitting || itemCount === 0}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-transform disabled:opacity-50",
                !submitting && "hover:scale-[1.01] active:scale-[0.99]",
              )}
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Valider la commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
