import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { CartDrawer, CheckoutDialog } from "@/components/Cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { asset } from "@/config/site";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description =
  "CardioSim is a silicone heart training model for practising cardiac suturing outside the operating room. See it in 3D and order online.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://b777-7ao.github.io"),
  title: { default: "CardioSim: silicone heart model for suturing practice", template: "%s | CardioSim" },
  description,
  openGraph: {
    title: "CardioSim Heart Suturing Practice Model",
    description,
    images: [{ url: asset("/images/og.jpg"), width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CheckoutDialog />
        </CartProvider>
      </body>
    </html>
  );
}
