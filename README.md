# Smart Menu

Menu digital et prise de commande par QR code pour restaurants. Le client scanne le code sur sa table, parcourt le menu, commande — la cuisine suit chaque commande en direct sur un tableau de bord staff.

**Démo live :** [smart-menu-sigma.vercel.app](https://smart-menu-sigma.vercel.app)
**Espace staff (démo) :** [smart-menu-sigma.vercel.app/admin/login](https://smart-menu-sigma.vercel.app/admin/login)

## Le concept

- **Le client scanne** le QR code posé sur sa table (généré et imprimable depuis l'espace staff) — pas d'app à installer, pas de compte à créer.
- **Il commande** depuis son téléphone : menu par catégories avec photos, panier, note libre pour la cuisine.
- **Il suit sa commande** en temps réel, avec un écran de suivi animé : reçue → en préparation → prête → servie.
- **La cuisine suit tout** sur un tableau de bord type kanban, avec mise à jour automatique.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — configuration CSS-first
- [Prisma ORM 7](https://www.prisma.io) + PostgreSQL ([Neon](https://neon.tech))
- Auth admin par mot de passe unique, session JWT ([jose](https://github.com/panva/jose)) en cookie httpOnly
- Validation des formulaires avec [Zod](https://zod.dev)

## Fonctionnalités

**Côté client**
- Sélection de table (`/t`), menu digital par catégories avec photos, sans authentification
- Panier persistant en session, ajustement des quantités, animations
- Suivi de commande en temps réel et animé (polling léger) : reçue, en préparation, prête, servie

**Côté staff** (`/admin`, protégé par mot de passe)
- Tableau de bord des commandes actives façon kanban (Nouveau / En préparation / Prêt)
- Gestion complète du menu : catégories et articles (CRUD), disponibilité, ordre d'affichage
- Génération et impression des QR codes, un par table
- Statistiques du jour : commandes, chiffre d'affaires

## Lancer le projet en local

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD_HASH
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

Le menu de démo est accessible sur `/t`, l'espace staff sur `/admin/login`.
