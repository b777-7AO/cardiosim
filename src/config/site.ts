/**
 * Single source of truth for everything the CardioSim product team has to
 * confirm. A value of `null` renders as "To be confirmed" on the site.
 * Nothing in here is invented: fill in a field only once it is verified.
 */

export const TBC = "To be confirmed";

export const product = {
  name: "CardioSim Heart Suturing Practice Model",
  shortName: "CardioSim",
  /** Unit price in the smallest currency unit (e.g. cents). null = not yet set. */
  unitPrice: null as number | null,
  currency: "EUR",
  /** "in_stock" | "preorder" | "unavailable" | null (not yet confirmed) */
  availability: null as "in_stock" | "preorder" | "unavailable" | null,
  maxQuantity: 10,
  /** Shown under the buy box. null = not yet confirmed. */
  shippingNote: null as string | null,
};

export const contact = {
  /** Product support address. null hides the mail link and shows TBC. */
  supportEmail: null as string | null,
  companyLegalName: null as string | null,
  companyAddress: null as string | null,
};

/**
 * Checkout.
 *
 * The site is a static export, so live payment runs through a Stripe Payment
 * Link (created in the Stripe dashboard, quantity adjustable on Stripe's page).
 * While `stripePaymentLink` is null the checkout is in DEMO mode: the cart
 * works, but the checkout step states plainly that no order is placed and no
 * payment is taken.
 */
export const checkout = {
  stripePaymentLink: null as string | null,
};

export type Spec = { label: string; value: string | null };

export const specs: Spec[] = [
  { label: "Product name", value: product.name },
  { label: "Material", value: "Silicone (grade to be confirmed)" },
  { label: "Color", value: "Red body, white central vessel, white line on the front" },
  { label: "Intended use", value: "Practising heart suturing and stitching technique" },
  { label: "Training context", value: "Outside the operating room: at home or in training settings" },
  { label: "Included items", value: null },
  { label: "Care / cleaning", value: null },
  { label: "Dimensions", value: null },
  { label: "Weight", value: null },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Who is CardioSim designed for?",
    a: "Doctors, medical students and healthcare professionals who want to practise heart suturing and stitching technique on a physical model.",
  },
  {
    q: "Can it be used at home?",
    a: "Yes. CardioSim is made for practice outside the operating room, at home or in a training setting.",
  },
  {
    q: "What kind of stitching practice is it intended for?",
    a: "Hands-on suturing and stitching practice on a silicone heart model. The areas shown on this site are illustrative: a list of specific techniques will be published once it is confirmed.",
  },
  {
    q: "Is it an anatomical replica?",
    a: "No. CardioSim is a simplified, heart-shaped training model. It is built for practising technique, not as a museum-grade anatomical reproduction.",
  },
  {
    q: "Is it reusable?",
    a: "How many practice sessions one model withstands has not been confirmed yet. The answer will be published with the final product details.",
  },
  {
    q: "What is included?",
    a: "The CardioSim heart suturing practice model. Any further items are still to be confirmed and will be listed under product details.",
  },
  {
    q: "How can I order or contact CardioSim?",
    a: contact.supportEmail
      ? `Order in the purchase section of this page. For questions, write to ${contact.supportEmail}.`
      : "Ordering opens in the purchase section of this page once the price is confirmed. The contact address will be published on the contact page.",
  },
];

/**
 * Practice-area markers.
 *
 * Each marker is placed by casting a ray at the loaded model, so the points
 * stay on the surface even after the GLB is replaced:
 *   - `from`: direction the ray comes from, as [azimuth, elevation] in degrees
 *     (azimuth 0 = front, 90 = the viewer's right; elevation 90 = top)
 *   - `aim`: point the ray is aimed at, in units of the model's bounding box
 *     half-size, relative to its centre ([0,0,0] = centre, [0,1,0] = top)
 *
 * `validated: false` labels the marker "Illustrative practice area". Set it
 * to true only when the area and its use have been confirmed.
 */
export type SutureMarker = {
  id: string;
  name: string;
  kind: string;
  description: string;
  from: [number, number];
  aim: [number, number, number];
  validated: boolean;
};

export const sutureMarkers: SutureMarker[] = [
  {
    id: "central-vessel",
    name: "Central white vessel",
    kind: "Potential suturing zone",
    description: "The open white cylinder at the top centre of the model, with a free rim all the way round.",
    from: [0, 35],
    aim: [0.0, 0.78, 0.2],
    validated: false,
  },
  {
    id: "front-line",
    name: "White line on the front",
    kind: "Potential suturing zone",
    description: "A narrow white line set into the red silicone, running down the front right side.",
    from: [20, 0],
    aim: [0.33, -0.2, 0],
    validated: false,
  },
  {
    id: "front-surface",
    name: "Front surface",
    kind: "Training surface",
    description: "The broad, textured front wall of the model below the diagonal ridge.",
    from: [-10, -5],
    aim: [-0.15, -0.3, 0],
    validated: false,
  },
  {
    id: "top-vessel",
    name: "Top vessel form",
    kind: "Illustrative practice area",
    description: "One of the rounded red cylinders that rise from the top of the model beside the white vessel.",
    from: [-20, 30],
    aim: [-0.55, 0.7, 0],
    validated: false,
  },
];

/**
 * Views for the 3D explorer.
 * yaw / pitch in degrees, zoom as a fraction of the default camera distance,
 * focus in bounding-box half-size units (same convention as marker `aim`).
 */
export type DetailView = {
  id: string;
  label: string;
  caption: string;
  yaw: number;
  pitch: number;
  zoom: number;
  focus: [number, number, number];
  showMarkers?: boolean;
  showBounds?: boolean;
};

export const detailViews: DetailView[] = [
  {
    id: "full",
    label: "Full model",
    caption: "The complete model. Drag to turn it in any direction.",
    yaw: -20,
    pitch: 8,
    zoom: 1,
    focus: [0, 0, 0],
  },
  {
    id: "front",
    label: "Front",
    caption: "The front, with the diagonal ridge and the white line on the right.",
    yaw: 0,
    pitch: 4,
    zoom: 0.9,
    focus: [0, 0, 0],
  },
  {
    id: "back",
    label: "Back",
    caption: "The back is different from the front: flatter, with raised bands.",
    yaw: 180,
    pitch: 6,
    zoom: 0.9,
    focus: [0, 0, 0],
  },
  {
    id: "top",
    label: "Top opening",
    caption: "Seen from above: the open white vessel between the two red vessel forms.",
    yaw: -10,
    pitch: 58,
    zoom: 0.8,
    focus: [0, 0.45, 0],
  },
  {
    id: "surface",
    label: "Surface",
    caption: "The moulded surface texture of the red silicone, close up.",
    yaw: 14,
    pitch: 4,
    zoom: 0.5,
    focus: [0.25, -0.2, 0.5],
  },
  {
    id: "areas",
    label: "Practice areas",
    caption: "Illustrative practice areas. Select a blue marker to read about it.",
    yaw: -8,
    pitch: 14,
    zoom: 0.95,
    focus: [0, 0.1, 0],
    showMarkers: true,
  },
];

/** Path of the 3D model inside /public. Replace the file to swap the model. */
export const MODEL_PATH = "/models/cardiosim-heart.glb";

/** Degrees to turn the raw model about its vertical axis so the front faces the viewer. */
export const MODEL_YAW_DEG = 0;

/**
 * Snaps the model texture to the product's two real colours. Set to null when
 * the GLB comes from a colour-accurate scan and should be shown as it is.
 */
export const MODEL_RECOLOR: { red: string; white: string } | null = { red: "#e8101c", white: "#f4f1ec" };

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${basePath}${p}`;

export function formatPrice(minor: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(minor / 100);
}
