import type { Metadata } from "next";
import { Assistant, Cormorant_Garamond } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import ShopProvider from "@/components/ShopProvider";
import Header from "@/components/Header";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Assistant({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Auré & Mini — Little Bottles. Lasting Impressions.",
  description: "Authentic designer perfume miniatures. Little Bottles. Lasting Impressions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <ShopProvider>
            <Header />
            <main>{children}</main>
            <footer><p>© Auré &amp; Mini · Little Bottles. Lasting Impressions.</p></footer>
          </ShopProvider>
        </CartProvider>
      </body>
    </html>
  );
}
