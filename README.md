# Smart Menu

Menu digital et prise de commande par QR code pour restaurants. Le client scanne le code sur sa table, parcourt le menu, commande — la cuisine suit chaque commande en direct sur un tableau de bord staff.

**Démo live :** _à venir_
**Espace staff (démo) :** `/admin/login`

## Le concept

- **Le client scanne** un QR code posé sur sa table (`/t/{numéro}`) — pas d'app à installer, pas de compte à créer.
- **Il commande** depuis son téléphone : menu par catégories, panier, note libre pour la cuisine.
- **Il suit sa commande** en temps réel : reçue → en préparation → prête → servie.
- **La cuisine suit tout** sur un tableau de bord type kanban, avec mise à jour automatique.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — configuration CSS-first
- [Prisma ORM 7](https://www.prisma.io) + PostgreSQL ([Neon](https://neon.tech))
- Auth admin par mot de passe unique, session JWT ([jose](https://github.com/panva/jose)) en cookie httpOnly
- Validation des formulaires avec [Zod](https://zod.dev)

## Fonctionnalités

**Côté client**
- Menu digital par catégories, filtrable, sans authentification
- Panier persistant en session, ajustement des quantités
- Suivi de commande en temps réel (polling léger)

**Côté staff** (`/admin`, protégé par mot de passe)
- Tableau de bord des commandes actives façon kanban (Nouveau / En préparation / Prêt)
- Gestion complète du menu : catégories et articles (CRUD), disponibilité, ordre d'affichage
- Statistiques du jour : commandes, chiffre d'affaires

## Lancer le projet en local

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD_HASH
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

Le menu de démo est accessible sur `/t/1`, l'espace staff sur `/admin/login`.
