"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { CATS, useShop, type Cat } from "./ShopProvider";

const NOTES = [
  "Authentic designer miniatures · Little Bottles. Lasting Impressions.",
  "Try before you commit to the full bottle.",
  "Up to 7 miniatures per customer.",
];

const Icon = ({ d, children }: { d?: string; children?: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

export default function Header() {
  const { count, setOpen } = useCart();
  const { q, setQ, cat, setCat, searchOpen, setSearchOpen } = useShop();
  const router = useRouter();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [note, setNote] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMenu(false); }
      const el = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(el.tagName)) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const go = (c: Cat) => { setCat(c); setMenu(false); if (path !== "/") router.push("/"); };
  const onSearch = (v: string) => { setQ(v); if (path !== "/") router.push("/"); };

  return (
    <header className="topbar">
      <div className="topbar-in">
        <button className="iconbtn menu" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
          <Icon d={menu ? "M6 6l12 12M18 6 6 18" : "M3 6h18M3 12h18M3 18h18"} />
        </button>
        <Link href="/" className="logo" onClick={() => { setQ(""); setCat("All"); }}>
          <b>Auré &amp; Mini</b>
          <small>Little Bottles</small>
        </Link>
        <nav className="nav" aria-label="Main">
          {CATS.map((c) => (
            <button key={c} className={path === "/" && cat === c ? "on" : ""} onClick={() => go(c)}>
              {c === "All" ? "Shop all" : c}
            </button>
          ))}
        </nav>
        <div className="icons">
          <button className="iconbtn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
          </button>
          <button className="iconbtn cartbtn" aria-label={`Open cart${count ? `, ${count} items` : ""}`} onClick={() => setOpen(true)}>
            <Icon><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Icon>
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>

      {menu && (
        <div className="mobilemenu">
          {CATS.map((c) => <button key={c} onClick={() => go(c)}>{c === "All" ? "Shop all" : c}</button>)}
        </div>
      )}

      {searchOpen && (
        <div className="searchrow">
          <div className="searchrow-in">
            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search brand or perfume…"
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Search perfumes"
            />
            <button className="iconbtn" aria-label="Close search" onClick={() => { setSearchOpen(false); }}>
              <Icon d="M6 6l12 12M18 6 6 18" />
            </button>
          </div>
        </div>
      )}

      <div className="announce">
        <button aria-label="Previous" onClick={() => setNote((n) => (n + NOTES.length - 1) % NOTES.length)}>‹</button>
        <p key={note}>{NOTES[note]}</p>
        <button aria-label="Next" onClick={() => setNote((n) => (n + 1) % NOTES.length)}>›</button>
      </div>
    </header>
  );
}
