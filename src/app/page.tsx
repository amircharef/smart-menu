import Link from "next/link";
import { QrCode, ChefHat, Smartphone, ArrowRight } from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Le client scanne",
    description:
      "Un QR code par table renvoie vers le menu digital — pas d'app à installer, pas de compte à créer.",
  },
  {
    icon: Smartphone,
    title: "Il commande depuis sa table",
    description:
      "Menu par catégories, panier, note pour la cuisine — la commande part directement en salle.",
  },
  {
    icon: ChefHat,
    title: "La cuisine suit en direct",
    description:
      "Un tableau de bord staff affiche les commandes par statut : nouveau, en préparation, prêt, servi.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <p className="font-mono text-xs tracking-wide text-accent uppercase">
          Démo produit
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Le menu digital qui prend les commandes à votre place
        </h1>
        <p className="mt-5 text-lg text-muted">
          Smart Menu remplace le papier par un QR code : commande depuis la table, suivi en cuisine en
          temps réel, zéro friction pour vos équipes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/t/1"
            className="flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Essayer la démo (Table 1)
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground hover:border-border-hover"
          >
            Espace staff
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={18} />
                </div>
                <h3 className="font-display mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
