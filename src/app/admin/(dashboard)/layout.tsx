import { AdminSidebar } from "@/components/admin/AdminSidebar";

// L'espace staff lit des données opérationnelles live (commandes, stock du menu) :
// on force le rendu dynamique pour éviter que Next.js ne les fige en HTML statique au build.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
