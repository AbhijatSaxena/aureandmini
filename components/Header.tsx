"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="hero">
      <button className="bag" onClick={() => setOpen(true)} aria-label={`Open cart${count ? `, ${count} items` : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
        </svg>
        {count > 0 && <span className="badge">{count}</span>}
      </button>
      <Link href="/" className="title"><h1>Auré &amp; Mini</h1></Link>
      <p className="tagline">Little Bottles. Lasting Impressions.</p>
      <hr />
    </header>
  );
}
