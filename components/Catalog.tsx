"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Bottle from "./Bottle";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartProvider";
import { inr } from "@/lib/pricing";
import { MAX_PER_CUSTOMER } from "@/lib/types";
import type { PublicProduct } from "@/lib/types";

const CATS = ["All", "For Her", "For Him", "Unisex"] as const;
const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
} as const;

// lower-case, strip accents and punctuation so "Cœur", "N°22" and "n 22" all match
const norm = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

export default function Catalog({ products }: { products: PublicProduct[] }) {
  const { cart, count, add, setQty } = useCart();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const [msg, setMsg] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // press "/" anywhere to jump to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const index = useMemo(() => new Map(products.map((p) => [p.id, norm(`${p.brand} ${p.name} ${p.category} ${p.size}ml`)])), [products]);
  const brands = useMemo(
    () => [...new Set(products.filter((p) => cat === "All" || p.category === cat).map((p) => p.brand))].sort(),
    [products, cat],
  );
  const shown = useMemo(() => {
    const tokens = norm(q).split(" ").filter(Boolean);
    const list = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!brand || p.brand === brand) &&
        tokens.every((t) => index.get(p.id)!.includes(t)),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
    return list;
  }, [products, cat, brand, q, sort, index]);

  const reset = () => { setQ(""); setCat("All"); setBrand(""); };

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Authentic designer miniatures</div>
        <h1>Little Bottles.<br /><em>Lasting Impressions.</em></h1>
        <p>Try the world&rsquo;s most loved fragrances in travel-ready sizes, before you commit to the full bottle.</p>
        <div className="search" role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search brand or perfume…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search perfumes"
          />
          {q ? <button className="clear" onClick={() => { setQ(""); searchRef.current?.focus(); }} aria-label="Clear search">×</button> : <kbd>/</kbd>}
        </div>
      </section>

      <div className="filterbar">
        <div className="tabs">
          {CATS.map((c) => (
            <button key={c} className={`chip${c === cat ? " on" : ""}`} onClick={() => { setCat(c); setBrand(""); }}>{c}</button>
          ))}
        </div>
        <div className="tabs" style={{ marginTop: 8 }} aria-label="Brands">
          <button className={`chip sm${brand === "" ? " on" : ""}`} onClick={() => setBrand("")}>All brands</button>
          {brands.map((b) => (
            <button key={b} className={`chip sm${brand === b ? " on" : ""}`} onClick={() => setBrand(brand === b ? "" : b)}>{b}</button>
          ))}
        </div>
      </div>

      <div className="resultbar">
        <span>{shown.length} {shown.length === 1 ? "perfume" : "perfumes"}{q && <> for &ldquo;{q}&rdquo;</>}</span>
        <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort">
          {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {msg && <p className="notice">{msg}</p>}
      <div className="grid">
        {shown.map((p) => (
          <article className="card" key={p.id}>
            <div className="thumb">
              {p.image ? <img src={p.image} alt={`${p.brand} ${p.name}`} width={300} height={400} loading="lazy" decoding="async" /> : <Bottle brand={p.brand} name={p.name} size={p.size} />}
              <span className="size">{p.size} ml</span>
              {p.soldOut && <span className="soldout-tag">Sold out</span>}
            </div>
            <div className="meta">
              <span className="brand">{p.brand}</span>
              <h3>{p.name}</h3>
              <span className="muted small">{p.category}</span>
            </div>
            <div className="cardfoot">
              <span className="price">{inr(p.price)}</span>
              {p.soldOut ? (
                <button className="btn sm" disabled>Sold out</button>
              ) : cart[p.id] ? (
                <div className="stepper">
                  <button aria-label="Remove one" onClick={() => { setMsg(null); setQty(p.id, cart[p.id] - 1); }}>−</button>
                  <span>{cart[p.id]}</span>
                  <button
                    aria-label="Add one"
                    onClick={() => setMsg(count >= MAX_PER_CUSTOMER ? `Maximum ${MAX_PER_CUSTOMER} miniatures per customer.` : (setQty(p.id, cart[p.id] + 1), null))}
                  >+</button>
                </div>
              ) : (
                <button className="btn sm" onClick={() => setMsg(add(p.id))}>Add</button>
              )}
            </div>
          </article>
        ))}
        {shown.length === 0 && (
          <div className="empty">
            <b>No perfumes found</b>
            Try a different spelling, or <button className="link" onClick={reset}>clear all filters</button>.
          </div>
        )}
      </div>
      <CartDrawer products={products} />
    </>
  );
}
