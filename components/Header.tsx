"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="hero">
      <button className="bag" onClick={() => setOpen(true)} aria-label="Open bag">
        Bag{count > 0 && <span className="badge">{count}</span>}
      </button>
      <Link href="/" className="title"><h1>Auré &amp; Mini</h1></Link>
      <p className="tagline">Little Bottles. Lasting Impressions.</p>
      <hr />
    </header>
  );
}
