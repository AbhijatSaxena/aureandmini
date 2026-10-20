# Auré & Mini

*Little Bottles. Lasting Impressions.* — perfume-miniature store (Next.js 16) with an admin area.

- `/` storefront (filter by category/brand, search, bag, max 7 pieces per customer)
- `/checkout` → order saved, `/order/<id>` confirmation
- `/admin` orders + status workflow (new → confirmed → paid → shipped → delivered / cancelled), revenue & profit
- `/admin/pricing` default / per-brand / per-model margin %, cost basis, image URL override, sold-out toggle

Selling price = cost × (1 + margin%), rounded up to ₹5. Priority: model → brand → default.
Prices are always recomputed on the server at checkout; cost prices never reach the storefront.

## Deploy on Vercel
1. Import this repo in Vercel.
2. Storage → add **Neon Postgres** (Marketplace); it injects `DATABASE_URL`. Tables are created automatically.
3. Set env vars: `ADMIN_PASSWORD`, `SESSION_SECRET`, optional `NEXT_PUBLIC_WHATSAPP` (see `.env.example`).

## Local dev
`npm i && ADMIN_PASSWORD=x npm run dev` — without `DATABASE_URL` data goes to `.data/store.json`.

## Catalogue
`data/products.json` was generated from the supplied price list (cost prices). Keep the repo private.
