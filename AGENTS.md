<!-- BEGIN:nextjs-agent-rules -->

# Repository agent guide

## Project overview

SellerDesk is a lightweight demo workspace for small social-commerce sellers. It supports product and inventory management, order creation and status changes, delivery charge settings, dashboard summaries, and printable order slips. This repository is an assignment demo; it currently has no authentication, API, database, or shared multi-user storage.

The stack is Next.js 16.4.5 App Router, React 19, strict TypeScript, Tailwind CSS 4, local UI primitives built with Base UI and Radix UI, Lucide icons, and Sonner notifications. Bun 1.4.2 is the package manager.

## Repository map

- `src/app/`: the App Router entry point, root layout, metadata, and global CSS. The app currently exposes one route; navigation between dashboard sections is client-side state, not separate URLs.
- `src/components/sellerdesk-app.tsx`: client-side application shell and view selection.
- `src/components/dashboard/`, `orders/`, `products/`, `settings/`, `layout/`, and `shared/`: feature views and shared interface pieces.
- `src/components/ui/`: reusable dialog, form, table, toast, and other UI primitives. Prefer these over duplicating primitive behavior.
- `src/hooks/use-sellerdesk.ts`: client state orchestration, validation calls, notifications, and persistence effects.
- `src/service/`: business rules and calculations. Keep domain logic here rather than embedding it in view components.
- `src/lib/`: constants, demo data, browser storage, and general helpers.
- `src/types.ts`: shared application types.
- `public/` and `src/assets/images/`: static and imported image assets.

## Architecture and data

- `src/app/page.tsx` renders `SellerDeskApp`; `src/app/layout.tsx` owns document metadata, fonts, global styles, and the Sonner toaster.
- Product and order data plus delivery charges are stored in the current browser profile under `sellerdesk-data`. The selected section is stored separately under `sellerdesk-active-page`. Demo products and orders seed a first visit or recover from unusable stored JSON.
- Browser APIs such as `window`, `localStorage`, `window.confirm`, and printing belong in client components, effects, or guarded browser-only helpers. Keep server-rendered entry files free of unguarded browser access.
- Persisted orders may not have `deliveryArea` or `deliveryCharge`; those fields are optional for older saved records. Preserve compatibility when changing the data shape and add explicit migration or fallback handling for new persisted fields.
- Order items snapshot the product name, SKU, price, and cost at order creation. Do not silently replace historical order details with the current product values.

## Domain rules to preserve

- Product names, SKUs, and categories must be non-empty. Prices must be finite, selling price must be greater than zero, cost price and stock cannot be negative, and stock must be a whole number. SKUs are unique without regard to letter case.
- A product referenced by any order cannot be deleted in this demo.
- New orders start as `PENDING`. Creating a pending order does not change stock. Confirmation checks stock and deducts the ordered quantity; cancelling a confirmed order restores it.
- Delivered orders are final. A pending order must be confirmed before delivery, and a confirmed order cannot return directly to pending. A cancelled order can only be confirmed again, which must check and deduct stock again.
- Delivery charge is chosen from the current inside/outside Dhaka setting when the order is created and included in its total. Keep the order's saved charge if settings later change.
- Dashboard sales and estimated profit use delivered orders. Estimated profit is item gross margin (`price - costPrice`) times quantity; it does not include other operating costs. Low stock means five units or fewer.

## Implementation conventions

- Keep TypeScript strict and use the `@/*` alias for imports from `src/`.
- Keep validation and state transitions in `src/service/`; keep React components focused on rendering and user interaction. Use the existing hook for shared SellerDesk state unless the architecture is intentionally being changed.
- Follow existing named-export and kebab-case file naming patterns. Use the shared types in `src/types.ts` instead of repeating domain shapes.
- Use the existing UI primitives and Lucide icons. Styling uses Tailwind CSS 4 utilities plus CSS variables and global rules in `src/app/globals.css`; avoid introducing a separate styling system. Preserve the order slip's print behavior when changing its markup or styles.
- Keep sample content and default values in `src/lib/demo-data.ts` and `src/lib/constants.ts`, not inside feature views.

## Next.js version-specific work

The installed framework is Next.js 16.4.5. Before changing routing, rendering, caching, client/server boundaries, or CSS integration, read the applicable guide shipped with this installation under `node_modules/next/dist/docs/`. Start with:

- `01-app/01-getting-started/02-project-structure.md`
- `01-app/01-getting-started/03-layouts-and-pages.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/08-caching.md`
- `01-app/01-getting-started/11-css.md`

`next.config.ts` enables `cacheComponents`, `partialPrefetching`, and the React Compiler, and configures Tailwind CSS 4 through Turbopack. Check the installed docs for any feature-specific behavior or deprecations before changing these settings or relying on APIs from memory. The managed Next.js instruction block at the top of this file is maintained by Next.js; leave its markers and contents intact.

## Common commands

- `bun install`: install dependencies.
- `bun run dev`: start the development server.
- `bun run lint`: run ESLint.
- `bun run build`: create a production build.

Run the validation that fits the requested change. Do not add tests or run a test suite unless the user asks for testing or implementation verification.
