"use client";

import { useEffect, useRef } from "react";
import { checkout, formatPrice, product } from "@/config/site";
import { useCart } from "@/lib/cart";
import { IconClose } from "./Icons";
import { Picture } from "./Picture";
import { QuantityStepper } from "./Purchase";

/** Keeps a native <dialog> in sync with React state. */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const props = {
    ref,
    onClose,
    // click on the backdrop closes
    onClick: (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === ref.current) onClose();
    },
  };
  return props;
}

function Subtotal({ quantity }: { quantity: number }) {
  return (
    <div className="flex items-baseline justify-between text-[0.9375rem]">
      <span className="text-mute">Subtotal</span>
      <span className="font-medium tabular-nums">
        {product.unitPrice !== null ? formatPrice(product.unitPrice * quantity) : "Price to be confirmed"}
      </span>
    </div>
  );
}

export function CartDrawer() {
  const { quantity, open, setOpen, setQuantity, clear, setCheckoutOpen } = useCart();
  const dialog = useDialog(open, () => setOpen(false));

  return (
    <dialog {...dialog} className="drawer" aria-labelledby="cart-title">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-4.5">
          <h2 id="cart-title" className="text-lg font-medium tracking-[-0.015em]">
            Cart
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="-mr-2 grid size-9 place-items-center rounded-lg text-mute hover:bg-paper hover:text-ink"
          >
            <IconClose />
          </button>
        </div>

        {quantity === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-6">
            <p className="text-lg font-medium tracking-[-0.015em]">Your cart is empty.</p>
            <p className="mt-2 text-[0.9375rem] text-mute">Add the CardioSim heart from the order section.</p>
            <a href="#order" onClick={() => setOpen(false)} className="btn btn-ink mt-6">
              Go to order section
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="flex gap-4 border-b border-line py-6">
                <div className="grid size-22 shrink-0 place-items-center rounded-xl bg-paper">
                  <Picture name="heart-hero" alt="" width={1024} height={1024} className="size-18 object-contain mix-blend-multiply" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug tracking-[-0.01em]">{product.name}</p>
                  <p className="mt-1 text-sm text-mute">
                    {product.unitPrice !== null ? formatPrice(product.unitPrice) : "Price to be confirmed"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity in cart" />
                    <button type="button" onClick={clear} className="text-sm text-mute underline-offset-4 hover:text-ink hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-line px-6 py-5">
              <Subtotal quantity={quantity} />
              <p className="mt-1.5 text-[0.8125rem] text-mute">Shipping costs are to be confirmed.</p>
              <button
                type="button"
                className="btn btn-red mt-5 w-full"
                onClick={() => {
                  setOpen(false);
                  setCheckoutOpen(true);
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/**
 * Checkout step.
 * Live: hands over to the Stripe Payment Link (payment happens on Stripe).
 * Demo: says plainly that nothing is ordered and nothing is charged.
 */
export function CheckoutDialog() {
  const { quantity, checkoutOpen, setCheckoutOpen } = useCart();
  const dialog = useDialog(checkoutOpen, () => setCheckoutOpen(false));
  const live = !!checkout.stripePaymentLink && product.unitPrice !== null;

  return (
    <dialog {...dialog} className="modal" aria-labelledby="checkout-title">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {!live && <span className="tag mb-3">Demo checkout</span>}
            <h2 id="checkout-title" className="text-xl font-medium tracking-[-0.02em]">
              {live ? "Continue to secure payment" : "Payment is not enabled yet"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close checkout"
            onClick={() => setCheckoutOpen(false)}
            className="-mr-2 -mt-1 grid size-9 place-items-center rounded-lg text-mute hover:bg-paper hover:text-ink"
          >
            <IconClose />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-line px-4 py-3.5 text-[0.9375rem]">
          <div className="flex items-baseline justify-between gap-4">
            <span>{product.name}</span>
            <span className="shrink-0 tabular-nums text-mute">× {Math.max(1, quantity)}</span>
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <Subtotal quantity={Math.max(1, quantity)} />
          </div>
        </div>

        {live ? (
          <>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-mute">
              Payment is handled by Stripe. You can confirm the quantity and enter your shipping details there. No
              account is needed.
            </p>
            <a href={checkout.stripePaymentLink!} className="btn btn-red mt-6 w-full" rel="noopener">
              Pay with Stripe
            </a>
          </>
        ) : (
          <>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-mute">
              This is a preview of the checkout step. <strong className="font-medium text-ink">No order has been placed
              and no payment has been taken.</strong> Live checkout through Stripe opens once the price is confirmed.
            </p>
            <button type="button" className="btn btn-ink mt-6 w-full" onClick={() => setCheckoutOpen(false)}>
              Close
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
