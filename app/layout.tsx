import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Auré & Mini — Little Bottles. Lasting Impressions.",
  description: "Authentic designer perfume miniatures. Little Bottles. Lasting Impressions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <footer><p>© Auré &amp; Mini · Little Bottles. Lasting Impressions.</p></footer>
        </CartProvider>
      </body>
    </html>
  );
}
