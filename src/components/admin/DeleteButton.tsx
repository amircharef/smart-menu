"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
}) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(confirmMessage)) return;
    startTransition(() => action());
  }

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      aria-label="Supprimer"
      className="rounded-lg border border-border p-1.5 text-subtle transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
