import type { Metadata } from "next";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auré & Mini — Little Bottles. Lasting Impressions.",
  description: "Authentic designer perfume miniatures. Little Bottles. Lasting Impressions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
