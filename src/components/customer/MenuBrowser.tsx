"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X, Loader2, UtensilsCrossed, Check } from "lucide-react";
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

function ItemImage({ image, name }: { image: string | null; name: string }) {
  if (!image) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-accent/15 to-accent/5 text-accent/40">
        <UtensilsCrossed size={26} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-24 w-24 shrink-0 rounded-2xl object-cover"
    />
  );
}

function MenuItemCard({
  item,
  qty,
  onSetQuantity,
}: {
  item: MenuItemData;
  qty: number;
  onSetQuantity: (id: string, qty: number) => void;
}) {
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    onSetQuantity(item.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 rounded-2xl border bg-surface p-3 transition-colors",
        qty > 0 ? "border-accent/40" : "border-border",
      )}
    >
      <ItemImage image={item.image} name={item.name} />

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="font-medium leading-snug">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-accent-dark">
            {formatDA(item.price)}
          </p>

          {qty === 0 ? (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent text-white"
              aria-label="Ajouter"
            >
              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check size={16} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-border bg-background px-1 py-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onSetQuantity(item.id, qty - 1)}
                aria-label="Retirer"
                className="flex h-7 w-7 items-center justify-center rounded-full text-accent hover:bg-surface-hover"
              >
                <Minus size={14} />
              </motion.button>
              <motion.span
                key={qty}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="w-4 text-center text-sm font-semibold"
              >
                {qty}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onSetQuantity(item.id, qty + 1)}
                aria-label="Ajouter"
                className="flex h-7 w-7 items-center justify-center rounded-full text-accent hover:bg-surface-hover"
              >
                <Plus size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
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
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace("cat-", ""));
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  function scrollToCategory(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            {categories.map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => scrollToCategory(c.id)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent",
                  )}
                >
                  {c.name}
                </button>
              );
            })}
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
          <section
            key={category.id}
            id={`cat-${category.id}`}
            ref={(el) => {
              sectionRefs.current[category.id] = el;
            }}
            className="mb-10 scroll-mt-32"
          >
            <h2 className="font-display mb-4 text-xl font-semibold">{category.name}</h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  qty={cart[item.id] ?? 0}
                  onSetQuantity={setQuantity}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <AnimatePresence>
        {itemCount > 0 && !cartOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onClick={() => setCartOpen(true)}
            className="fixed inset-x-5 bottom-5 z-20 mx-auto flex max-w-2xl items-center justify-between rounded-full bg-accent px-6 py-4 text-white shadow-lg shadow-accent/30"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <ShoppingBag size={18} />
              {itemCount} article{itemCount > 1 ? "s" : ""}
            </span>
            <span className="font-display font-semibold">{formatDA(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-end justify-center bg-black/40"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-t-3xl bg-background p-6 shadow-2xl"
              style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
            >
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
                <AnimatePresence initial={false}>
                  {cartEntries.map(([id, qty]) => {
                    const item = allItems.get(id);
                    if (!item) return null;
                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-subtle">
                            {formatDA(item.price)} × {qty}
                          </p>
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
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={placeOrder}
                disabled={submitting || itemCount === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                Valider la commande
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
