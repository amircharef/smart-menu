"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/app/admin/(dashboard)/menu/actions";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors";

const labelClass = "mb-1.5 block text-xs text-muted";

interface MenuItemData {
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  available: boolean;
  order: number;
}

export function MenuItemForm({
  action,
  item,
  categories,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  item?: MenuItemData;
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {state.error && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label className={labelClass}>Nom *</label>
        <input name="name" required defaultValue={item?.name} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          required
          defaultValue={item?.description}
          className={cn(inputClass, "min-h-20 resize-none")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Prix (DA) *</label>
          <input
            type="number"
            name="price"
            required
            min={0}
            defaultValue={item?.price}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Catégorie *</label>
          <select
            name="categoryId"
            required
            defaultValue={item?.categoryId ?? ""}
            className={cn(inputClass, "appearance-none")}
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Image (URL, optionnel)</label>
        <input
          name="image"
          type="url"
          placeholder="https://…"
          defaultValue={item?.image ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          name="order"
          defaultValue={item?.order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="available"
          defaultChecked={item?.available ?? true}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        Disponible à la commande
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending && <Loader2 className="animate-spin" size={16} />}
        {item ? "Enregistrer" : "Créer l'article"}
      </button>
    </form>
  );
}
