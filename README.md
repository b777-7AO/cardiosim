# CardioSim

Single-product website for the CardioSim Anatomical Silicone Heart: interactive 3D viewer, product page, cart and checkout-ready architecture.

Next.js (App Router, static export), TypeScript, Tailwind CSS, Three.js with React Three Fiber and Drei.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in ./out
npm run deploy       # build for GitHub Pages and publish ./out to the gh-pages branch
```

## What still needs real data

Everything unconfirmed lives in **`src/config/site.ts`** and renders as "To be confirmed" until filled in. Nothing on the site is invented.

| What | Where in `site.ts` |
|---|---|
| Price, currency, availability, shipping note | `product` |
| Support email, legal name, address | `contact` |
| Live payment | `checkout.stripePaymentLink` |
| Material grade, dimensions, weight, included components, care | `specs` |
| Suture areas and their training purpose | `sutureMarkers` |
| Close-up views in the explorer | `detailViews` |

Legal text (shipping, privacy controller, terms) is in `src/app/[slug]/page.tsx`.

## Going live with payment

The site is static, so checkout uses a **Stripe Payment Link**:

1. In Stripe, create a product and a Payment Link. Enable "let customers adjust quantity" and shipping address collection.
2. Set `checkout.stripePaymentLink` to the link URL and `product.unitPrice` to the same price (in cents).
3. Deploy.

Until both values are set the checkout is in demo mode: the cart works, and the checkout step says that no order is placed and no payment is taken. There is no fake success screen.

## Replacing the 3D model

The viewer loads `public/models/cardiosim-heart.glb`. To swap it:

1. Export the new model as GLB.
2. Compress it:
   ```bash
   npx @gltf-transform/cli optimize new.glb public/models/cardiosim-heart.glb \
     --compress meshopt --texture-compress webp --texture-size 2048 --simplify false
   ```
3. If the heart does not face the viewer, change `MODEL_YAW_DEG` in `src/config/site.ts`.

Nothing else changes. The viewer centres and scales any model, applies the silicone material to its textures, and places the suture markers by raycasting onto the new surface (see the comment on `sutureMarkers`).

**About the current model:** `creative/models/heart-tripo.glb` was generated with Higgsfield (Tripo H3.1) from the reference render. It is a visualisation of the specified product (red body, one white central vessel), not a scan of the manufactured part. Replace it with the production CAD or scan when available.

## Replacing images

Source images are in `creative/reference/`. Put the new file there under the same name and run `node scripts/build-images.mjs`. It writes the WebP/AVIF files the site uses to `public/images`.

The current pictures are Higgsfield renders, captioned on the site as product visualisation. Prompts for the full campaign, including video, are in `creative/higgsfield-prompts.md`.

## Brand

- Logo: `public/brand/cardiosim-logo.svg` (horizontal), `public/brand/cardiosim-icon.svg` (icon), `src/app/icon.svg` (favicon). The wordmark SVG uses live text in Geist: convert it to outlines before sending it to print.
- Colours and type scale: `src/app/globals.css`.

## Structure

```
src/config/site.ts            product data, specs, FAQ, markers, views
src/components/heart/         3D viewer (HeartCanvas) and lazy loader
src/components/Explorer.tsx   3D explorer section with controls and markers
src/components/Purchase.tsx   order section
src/components/Cart.tsx       cart drawer and checkout step
src/lib/cart.tsx              cart state (saved in the browser)
creative/                     reference renders, source model, Higgsfield prompts
```
