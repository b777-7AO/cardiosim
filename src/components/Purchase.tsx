"use client";

import Link from "next/link";
import { useState } from "react";
import { TBC, checkout, contact, formatPrice, product } from "@/config/site";
import { useCart } from "@/lib/cart";
import { IconMinus, IconPlus } from "./Icons";
import { Picture } from "./Picture";

const availabilityLabel = {
  in_stock: "In stock",
  preorder: "Available for pre-order",
  unavailable: "Currently unavailable",
} as const;

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex h-11.5 items-center rounded-[0.625rem] border border-[#cfd7df]" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="grid h-full w-11 place-items-center text-ink disabled:text-line"
      >
        <IconMinus width={16} height={16} />
      </button>
      <output className="w-8 text-center text-[0.9375rem] font-medium tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= product.maxQuantity}
        onClick={() => onChange(value + 1)}
        className="grid h-full w-11 place-items-center text-ink disabled:text-line"
      >
        <IconPlus width={16} height={16} />
      </button>
    </div>
  );
}

export function Purchase() {
  const { add, quantity: inCart, setCheckoutOpen, setQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const live = !!checkout.stripePaymentLink && product.unitPrice !== null;
  const purchasable = product.availability !== "unavailable";

  const buyNow = () => {
    if (inCart === 0) setQuantity(qty);
    setCheckoutOpen(true);
  };

  return (
    <section id="order" className="border-t border-line bg-paper py-20 lg:py-28">
      <div className="frame grid items-center gap-x-8 gap-y-10 lg:grid-cols-12">
        <figure className="grid place-items-center rounded-2xl border border-line bg-white p-6 lg:col-span-6">
          <Picture
            name="heart-hero"
            alt="CardioSim Anatomical Silicone Heart, front view"
            width={1024}
            height={1024}
            className="h-auto w-full max-w-[30rem]"
          />
        </figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.028em] text-balance">
            CardioSim Anatomical Silicone Heart
          </h2>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {product.unitPrice !== null ? (
              <p className="text-3xl font-medium tracking-[-0.02em] tabular-nums">{formatPrice(product.unitPrice)}</p>
            ) : (
              <p className="text-2xl font-medium tracking-[-0.02em]">Price to be confirmed</p>
            )}
            <p className="flex items-center gap-2 text-sm text-mute">
              <span
                aria-hidden
                className={`size-1.5 rounded-full ${product.availability === "in_stock" ? "bg-blue" : "bg-[#b9c4ce]"}`}
              />
              {product.availability ? availabilityLabel[product.availability] : `Availability: ${TBC.toLowerCase()}`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <button type="button" className="btn btn-red min-w-40 flex-1 sm:flex-none" disabled={!purchasable} onClick={() => add(qty)}>
              Add to Cart
            </button>
            <button type="button" className="btn btn-line flex-1 sm:flex-none" disabled={!purchasable} onClick={buyNow}>
              Checkout
            </button>
          </div>

          {!live && (
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-mute">
              Online payment is not enabled yet. The cart works as a preview: checking out places no order and takes no
              payment.
            </p>
          )}

          <dl className="mt-9 text-[0.9375rem]">
            <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-t border-line py-4">
              <dt className="text-mute">Shipping</dt>
              <dd>
                {product.shippingNote ?? <span className="tag">{TBC}</span>}{" "}
                <Link href="/shipping-returns/" className="ml-1 text-blue underline-offset-4 hover:underline">
                  Shipping & Returns
                </Link>
              </dd>
            </div>
            <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-y border-line py-4">
              <dt className="text-mute">Product support</dt>
              <dd>
                {contact.supportEmail ? (
                  <a href={`mailto:${contact.supportEmail}`} className="text-blue underline-offset-4 hover:underline">
                    {contact.supportEmail}
                  </a>
                ) : (
                  <Link href="/contact/" className="text-blue underline-offset-4 hover:underline">
                    Contact page
                  </Link>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
