"use client";
import { useMemo, useState } from "react";
import Bottle from "./Bottle";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartProvider";
import { inr } from "@/lib/pricing";
import type { PublicProduct } from "@/lib/types";

const CATS = ["All", "For Her", "For Him", "Unisex"] as const;

export default function Catalog({ products }: { products: PublicProduct[] }) {
  const { add, setOpen } = useCart();
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
              {p.image ? <img src={p.image} alt={`${p.brand} ${p.name}`} loading="lazy" /> : <Bottle brand={p.brand} name={p.name} size={p.size} />}
            </div>
            <div className="meta">
              <span className="brand">{p.brand}</span>
              <h3>{p.name}</h3>
              <span className="muted small">{p.size} ml · {p.category}</span>
            </div>
            <div className="row between">
              <strong>{inr(p.price)}</strong>
              <button
                className="btn sm"
                disabled={p.soldOut}
                onClick={() => { const e = add(p.id); setMsg(e); if (!e) setOpen(true); }}
              >
                {p.soldOut ? "Sold out" : "Add"}
              </button>
            </div>
          </article>
        ))}
        {shown.length === 0 && <p className="muted">No perfumes match your filters.</p>}
      </div>
      <CartDrawer products={products} />
    </>
  );
}
