import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TBC, checkout, contact } from "@/config/site";

/**
 * Policy pages reached from the footer. They state only what is true of the
 * site today; everything the company still has to supply is marked.
 */

type Block = { heading: string; body: React.ReactNode };
type Policy = { title: string; intro: string; blocks: Block[] };

const pending = (what: string) => (
  <>
    <span className="tag mr-2">{TBC}</span>
    {what}
  </>
);

const policies: Record<string, Policy> = {
  contact: {
    title: "Contact",
    intro: "How to reach CardioSim about the product, an order or this website.",
    blocks: [
      {
        heading: "Product support",
        body: contact.supportEmail ? (
          <a className="text-blue underline-offset-4 hover:underline" href={`mailto:${contact.supportEmail}`}>
            {contact.supportEmail}
          </a>
        ) : (
          pending("The support address will be published here.")
        ),
      },
      {
        heading: "Company",
        body:
          contact.companyLegalName && contact.companyAddress
            ? `${contact.companyLegalName}, ${contact.companyAddress}`
            : pending("Legal name and postal address will be published here."),
      },
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    intro: "Delivery and return terms for the CardioSim Heart Suturing Practice Model.",
    blocks: [
      { heading: "Delivery regions and times", body: pending("Shipping destinations and delivery times.") },
      { heading: "Shipping costs", body: pending("Shipping costs per destination.") },
      { heading: "Returns", body: pending("Return period, condition of returned goods and refund procedure.") },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "What this website does with data, described as it works today.",
    blocks: [
      {
        heading: "Cart",
        body: "The contents of your cart are saved in your own browser (local storage) so they survive a page reload. They are not sent to CardioSim.",
      },
      {
        heading: "Tracking",
        body: "This website sets no tracking cookies and loads no analytics or advertising scripts. Fonts, images and the 3D model are served from the same host as the page.",
      },
      {
        heading: "Hosting",
        body: "The site is hosted on GitHub Pages. As with any web host, GitHub processes technical access data such as your IP address in order to deliver the pages.",
      },
      {
        heading: "Payment",
        body: checkout.stripePaymentLink
          ? "Payment is processed by Stripe on Stripe's own checkout page. CardioSim does not receive your card details."
          : "Online payment is not enabled yet. When it is, payment will be processed by Stripe on Stripe's own checkout page.",
      },
      { heading: "Controller and your rights", body: pending("Name and address of the data controller and the full legal notice.") },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Terms of sale for orders placed through this website.",
    blocks: [
      { heading: "Seller", body: pending("Legal name, registered address and registration details of the seller.") },
      { heading: "Orders, prices and payment", body: pending("Terms of sale.") },
      {
        heading: "Intended use",
        body: "CardioSim is a training model for suturing practice. It is not a medical device for use on patients.",
      },
      { heading: "Warranty and liability", body: pending("Warranty and liability terms.") },
    ],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: policies[slug]?.title };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();

  return (
    <article className="frame pb-24 pt-36 lg:pb-32 lg:pt-44">
      <div className="max-w-[44rem]">
        <Link href="/" className="text-sm text-blue underline-offset-4 hover:underline">
          Back to CardioSim
        </Link>
        <h1 className="h-section mt-6">{policy.title}</h1>
        <p className="lede mt-5">{policy.intro}</p>
        <dl className="mt-12">
          {policy.blocks.map((b) => (
            <div key={b.heading} className="border-t border-line py-6 last:border-b">
              <dt className="font-medium tracking-[-0.01em]">{b.heading}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-mute">{b.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
