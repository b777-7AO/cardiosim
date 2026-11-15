/**
 * Single source of truth for everything the CardioSim product team has to
 * confirm. A value of `null` renders as "To be confirmed" on the site.
 * Nothing in here is invented: fill in a field only once it is verified.
 */

export const TBC = "To be confirmed";

export const product = {
  name: "CardioSim Anatomical Silicone Heart",
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
  { label: "Main color", value: "Deep red" },
  { label: "Vessel color", value: "White (primary central vessel)" },
  { label: "Intended application", value: "Surgical suturing practice outside the clinical environment" },
  { label: "Dimensions", value: null },
  { label: "Weight", value: null },
  { label: "Included components", value: null },
  { label: "Care instructions", value: null },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Who is CardioSim designed for?",
    a: "Doctors, surgeons, medical students and cardiovascular specialists who want to rehearse suturing and stitching technique on a physical, three-dimensional heart model.",
  },
  {
    q: "Can CardioSim be used for home practice?",
    a: "Yes. CardioSim is a training model for use outside the clinical environment: at home, in a university laboratory or in a medical training facility.",
  },
  {
    q: "Which surgical techniques can be practiced?",
    a: "CardioSim is made for suturing and stitching practice. The list of specific techniques and the practice areas they belong to is being confirmed by the product team. Until then, the points shown in the 3D explorer are demonstration points.",
  },
  {
    q: "Can the product be reused?",
    a: "CardioSim is intended as a reusable model. How many practice sessions it withstands has not been confirmed yet and will be published with the final specifications.",
  },
  {
    q: "What is included with an order?",
    a: "The CardioSim Anatomical Silicone Heart. Any further components are still to be confirmed and will be listed in the specifications.",
  },
  {
    q: "How can I contact CardioSim?",
    a: contact.supportEmail
      ? `Write to ${contact.supportEmail}.`
      : "The support address is being set up and will be published on the contact page.",
  },
];

/**
 * Suture markers.
 *
 * Each marker is placed by casting a ray at the loaded model, so the points
 * stay on the surface even after the GLB is replaced:
 *   - `from`: direction the ray comes from, as [azimuth, elevation] in degrees
 *     (azimuth 0 = front, 90 = the viewer's right; elevation 90 = top)
 *   - `aim`: point the ray is aimed at, in units of the model's bounding box
 *     half-size, relative to its centre ([0,0,0] = centre, [0,1,0] = top)
 *
 * `validated: false` labels the marker as a demonstration point. Set it to
 * true only when the product team has confirmed the area and its purpose.
 */
export type SutureMarker = {
  id: string;
  name: string;
  purpose: string;
  description: string;
  from: [number, number];
  aim: [number, number, number];
  validated: boolean;
};

const PENDING = "Practice purpose pending confirmation by the CardioSim product team.";

export const sutureMarkers: SutureMarker[] = [
  {
    id: "aortic-arch",
    name: "Aortic arch",
    purpose: PENDING,
    description: "The white central vessel where it curves over the top of the heart. The open branch stubs sit directly above this point.",
    from: [-10, 35],
    aim: [-0.05, 0.62, 0.0],
    validated: false,
  },
  {
    id: "vessel-root",
    name: "Vessel root",
    purpose: PENDING,
    description: "The junction where the white vessel meets the red body of the heart.",
    from: [-8, 12],
    aim: [-0.16, 0.36, 0.1],
    validated: false,
  },
  {
    id: "anterior-surface",
    name: "Anterior ventricular surface",
    purpose: PENDING,
    description: "The broad front wall of the heart, crossed by raised surface vessels.",
    from: [-12, -5],
    aim: [-0.22, -0.3, 0],
    validated: false,
  },
  {
    id: "pulmonary-trunk",
    name: "Pulmonary trunk",
    purpose: PENDING,
    description: "The red vessel that crosses in front of the white vessel and ends in an open stub.",
    from: [30, 30],
    aim: [0.35, 0.42, 0.1],
    validated: false,
  },
];

/**
 * Close-up views for "Explore the details".
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
    caption: "The complete heart. Drag to turn it in any direction.",
    yaw: 0,
    pitch: 0,
    zoom: 1,
    focus: [0, 0, 0],
  },
  {
    id: "surface",
    label: "Silicone surface",
    caption: "Fine surface texture across the front wall of the heart.",
    yaw: -18,
    pitch: 4,
    zoom: 0.5,
    focus: [0.1, -0.2, 0.5],
  },
  {
    id: "contours",
    label: "Anatomical contours",
    caption: "Folds, grooves and raised surface vessels, seen from the side.",
    yaw: 62,
    pitch: 8,
    zoom: 0.68,
    focus: [0, 0.05, 0.3],
  },
  {
    id: "vessel",
    label: "White vessel",
    caption: "The primary central vessel is the only white element of the model.",
    yaw: 14,
    pitch: 26,
    zoom: 0.56,
    focus: [-0.05, 0.62, 0.2],
  },
  {
    id: "zones",
    label: "Practice zones",
    caption: "Demonstration points. Select a blue marker to read about the area.",
    yaw: -8,
    pitch: 10,
    zoom: 0.92,
    focus: [0, 0.1, 0],
    showMarkers: true,
  },
  {
    id: "proportions",
    label: "Proportions",
    caption: "Overall envelope of the model. Measured dimensions are to be confirmed.",
    yaw: -32,
    pitch: 14,
    zoom: 1.12,
    focus: [0, 0, 0],
    showBounds: true,
  },
];

/** Path of the 3D model inside /public. Replace the file to swap the model. */
export const MODEL_PATH = "/models/cardiosim-heart.glb";

/** Degrees to turn the raw model about its vertical axis so the front faces the viewer. */
export const MODEL_YAW_DEG = -90;

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${basePath}${p}`;

export function formatPrice(minor: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(minor / 100);
}
