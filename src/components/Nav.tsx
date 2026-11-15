"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";
import { IconBag, IconClose, IconMenu } from "./Icons";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#explorer", label: "3D View" },
  { href: "/#details", label: "Details" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const { quantity, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto max-w-[66rem] rounded-2xl border bg-white/80 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
          scrolled ? "border-line shadow-[0_8px_30px_-18px_rgb(23_33_43/0.35)]" : "border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="flex h-14 items-center justify-between gap-4 pl-4 pr-2.5 sm:pl-5">
          <Link href="/" aria-label="CardioSim home" className="shrink-0">
            <Logo size={26} />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${quantity} ${quantity === 1 ? "item" : "items"}`}
              className="relative grid size-9.5 place-items-center rounded-lg text-ink transition-colors hover:bg-paper"
            >
              <IconBag />
              {quantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blue px-1 text-[0.625rem] font-semibold tabular-nums text-white">
                  {quantity}
                </span>
              )}
            </button>
            <Link href="/#order" className="btn btn-red btn-sm">
              Buy Now
            </Link>
            <button
              type="button"
              className="grid size-9.5 place-items-center rounded-lg text-ink hover:bg-paper md:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:hidden ${
            menu ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <ul className="min-h-0">
            {links.map((l) => (
              <li key={l.href} className="border-t border-line first:mt-1">
                <Link
                  href={l.href}
                  onClick={() => setMenu(false)}
                  tabIndex={menu ? 0 : -1}
                  className="block px-5 py-3.5 text-[0.9375rem] text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
