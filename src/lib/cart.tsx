"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { product } from "@/config/site";

type CartState = {
  quantity: number;
  open: boolean;
  checkoutOpen: boolean;
  add: (n: number) => void;
  setQuantity: (n: number) => void;
  clear: () => void;
  setOpen: (o: boolean) => void;
  setCheckoutOpen: (o: boolean) => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "cardiosim-cart";
const clamp = (n: number) => Math.max(0, Math.min(product.maxQuantity, Math.round(n)));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantity, setQty] = useState(0);
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // The cart lives in this browser only. Storage can be unavailable (private
  // windows), so every access is guarded and the cart still works without it.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setQty(clamp(Number(JSON.parse(raw).quantity) || 0));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ quantity }));
    } catch {}
  }, [quantity, loaded]);

  const add = useCallback((n: number) => {
    setQty((q) => clamp(q + n));
    setOpen(true);
  }, []);
  const setQuantity = useCallback((n: number) => setQty(clamp(n)), []);
  const clear = useCallback(() => setQty(0), []);

  const value = useMemo(
    () => ({ quantity, open, checkoutOpen, add, setQuantity, clear, setOpen, setCheckoutOpen }),
    [quantity, open, checkoutOpen, add, setQuantity, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
