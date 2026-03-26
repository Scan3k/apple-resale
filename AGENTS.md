# Project instructions for Codex

## Project summary
This is a Next.js App Router + React + TypeScript + Tailwind CSS project for selling and buying used Apple devices.

## Source of truth
- `data/products.json` is the current source of truth.
- Product IDs must remain strings everywhere.

## Critical core files
- `types/product.ts`
- `lib/products.ts`
- `app/lib/products.ts`
- `data/products.json`
- `app/api/admin/products/*`

Do not change these casually.

## Zones

### Storefront
May change:
- `app/page.tsx`
- `app/catalog/*`
- public product page UI
- header / footer / layout UI

Must not change:
- Product contract
- data flow
- admin CRUD logic

### Admin
May change:
- `app/admin/*`
- `components/admin/*`
- admin write-side integration

Must not change:
- Product contract on its own
- shared core logic on its own

### Core
Owns:
- Product contract
- shared helpers
- normalize / validate
- data flow decisions

## Product rules
- `mainImage` is the primary image.
- `galleryImages` contains only additional images.
- `mainImage` must not be duplicated inside `galleryImages`.
- `specifications` is an array of `{ label, value }`.
- `description` is plain text, not HTML.
- Keep legacy `images` only as a compatibility field until explicitly removed.

## Engineering rules
- Do not create local duplicate types for Product.
- Prefer minimal safe changes.
- Do not mix zones in one task.
- If a task affects Product, data flow, or shared helpers, stop and classify it as a core-level change.

## Definition of done
- Build still works
- Existing working paths are not broken
- Scope stays inside the assigned zone
- Changes are minimal and reversible