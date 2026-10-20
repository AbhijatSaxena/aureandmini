# Auré & Mini

*Little Bottles. Lasting Impressions.* — perfume-miniature store (Next.js 16) with an admin area.

- `/` storefront (filter by category/brand, search, bag, max 7 pieces per customer)
- `/checkout` → order saved, `/order/<id>` confirmation
- `/admin` orders + status workflow (new → confirmed → paid → shipped → delivered / cancelled), revenue & profit
- `/admin/pricing` market price & purchase cost per item, default / per-brand / per-model +/− adjustment %, live profit & margin, image URL override, sold-out toggle

Selling price = market price × (1 + adjustment%) (unadjusted = exactly the market price; adjusted rounds to ₹5). Priority: model → brand → default. Purchase cost (bulk price) is used only for profit/margin.
Prices are always recomputed on the server at checkout; cost prices never reach the storefront.

## Deploy on Firebase App Hosting (project `aureandmini`)
Needs the Blaze plan (pay-as-you-go with a free quota).
1. Console → Upgrade to Blaze; Build → **Firestore Database** → Create database (production mode, pick a region).
2. Console → Build → **App Hosting** → Get started → connect GitHub repo `AbhijatSaxena/aureandmini`, live branch `ccr-6d99b5f1-ch35du` (or main), root `/`.
3. Create the two secrets (Cloud Secret Manager) named `ADMIN_PASSWORD` and `SESSION_SECRET` and grant the backend access:
   `npx firebase-tools apphosting:secrets:set ADMIN_PASSWORD` (then `SESSION_SECRET`) — see `apphosting.yaml`.
4. Push / "Create rollout". Admin is at `/admin` on the generated URL.

Firestore is only accessed from the server (firebase-admin), so keep the default locked-down rules.

## Local dev
`npm i && ADMIN_PASSWORD=x npm run dev` — data goes to `.data/store.json` (set `USE_FIRESTORE=1` + `GOOGLE_APPLICATION_CREDENTIALS` to use Firestore locally).

## Catalogue
`data/products.json` was generated from the supplied price list (market price = "Price (₹)", purchase cost = "Bulk Disc. Price (₹)"). Keep the repo private.
