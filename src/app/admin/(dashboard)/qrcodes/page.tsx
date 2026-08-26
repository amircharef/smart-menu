import type { Metadata } from "next";
import QRCode from "qrcode";
import { PrintButton } from "@/components/admin/PrintButton";

export const metadata: Metadata = {
  title: "QR codes",
  robots: { index: false, follow: false },
};

const MAX_TABLES = 60;

export default async function QrCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string }>;
}) {
  const { count: rawCount } = await searchParams;
  const count = Math.min(MAX_TABLES, Math.max(1, Number(rawCount) || 12));

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const tables = await Promise.all(
    Array.from({ length: count }, (_, i) => i + 1).map(async (n) => ({
      n,
      url: `${siteUrl}/t/${n}`,
      qr: await QRCode.toDataURL(`${siteUrl}/t/${n}`, {
        margin: 1,
        width: 400,
        color: { dark: "#2b2420", light: "#ffffff" },
      }),
    })),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-2xl font-semibold">QR codes des tables</h1>
          <p className="mt-1 text-sm text-muted">
            Un QR code par table, à imprimer et poser sur chaque table. Chacun renvoie vers{" "}
            <code className="rounded bg-surface-hover px-1 py-0.5 text-xs">{siteUrl}/t/N</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form className="flex items-center gap-2">
            <label htmlFor="count" className="text-xs text-muted">
              Nombre de tables
            </label>
            <input
              id="count"
              name="count"
              type="number"
              min={1}
              max={MAX_TABLES}
              defaultValue={count}
              className="w-20 rounded-full border border-border bg-surface px-3 py-1.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted hover:text-foreground"
            >
              Générer
            </button>
          </form>
          <PrintButton />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 print:mt-0 print:grid-cols-3 print:gap-6">
        {tables.map(({ n, qr }) => (
          <div
            key={n}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center print:break-inside-avoid print:border-black/20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt={`QR code table ${n}`}
              width={400}
              height={400}
              className="h-auto max-h-40 w-auto max-w-full"
            />
            <p className="font-display text-lg font-semibold">Table {n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
