"use client";
import { useMemo, useState } from "react";
import Bottle from "./Bottle";
import CartDrawer from "./CartDrawer";
import { MAX_PER_CUSTOMER } from "@/lib/types";
import { useCart } from "./CartProvider";
import { inr } from "@/lib/pricing";
import type { PublicProduct } from "@/lib/types";

const CATS = ["All", "For Her", "For Him", "Unisex"] as const;

export default function Catalog({ products }: { products: PublicProduct[] }) {
  const { cart, count, add, setQty } = useCart();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const brands = useMemo(
    () => [...new Set(products.filter((p) => cat === "All" || p.category === cat).map((p) => p.brand))].sort(),
    [products, cat],
  );
  const shown = products.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (!brand || p.brand === brand) &&
      (`${p.brand} ${p.name}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <div className="filters">
        <div className="tabs">
          {CATS.map((c) => (
            <button key={c} className={c === cat ? "on" : ""} onClick={() => { setCat(c); setBrand(""); }}>{c}</button>
          ))}
        </div>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
          <option value="">All brands</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
        <input placeholder="Search perfumes…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="grid">
        {shown.map((p) => (
          <article className="card" key={p.id}>
            <div className="thumb">
              {p.image ? <img src={p.image} alt={`${p.brand} ${p.name}`} width={300} height={400} loading="lazy" decoding="async" /> : <Bottle brand={p.brand} name={p.name} size={p.size} />}
            </div>
            <div className="meta">
              <span className="brand">{p.brand}</span>
              <h3>{p.name}</h3>
              <span className="muted small">{p.size} ml · {p.category}</span>
            </div>
            <div className="row between">
              <strong>{inr(p.price)}</strong>
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
        {shown.length === 0 && <p className="muted">No perfumes match your filters.</p>}
      </div>
      <CartDrawer products={products} />
    </>
  );
}
