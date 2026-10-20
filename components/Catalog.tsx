"use client";
import { useMemo, useState } from "react";
import Bottle from "./Bottle";
import CartDrawer from "./CartDrawer";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";
import { useShop } from "./ShopProvider";
import { inr } from "@/lib/pricing";
import { MAX_PER_CUSTOMER } from "@/lib/types";
import type { PublicProduct } from "@/lib/types";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  name: "Alphabetically, A–Z",
} as const;

// lower-case, strip accents and punctuation so "Cœur", "N°22" and "n 22" all match
const norm = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

export default function Catalog({ products }: { products: PublicProduct[] }) {
  const { cart, count, add, setQty } = useCart();
  const { q, setQ, cat, setCat, brand, setBrand } = useShop();
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const [msg, setMsg] = useState<string | null>(null);

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

  const reset = () => { setQ(""); setCat("All"); };

  return (
    <>
      <h1 className="pagetitle">{cat === "All" ? "Shop all miniatures" : cat}</h1>
      <div className="toolbar">
        <label className="filt">
          <span className="lbl">Brand</span>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
            <option value="">All brands</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label className="filt right">
          <span className="lbl">Sort by:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <span className="count">{shown.length} {shown.length === 1 ? "product" : "products"}</span>
      </div>
      {q && (
        <p className="searchnote">
          Results for &ldquo;{q}&rdquo; <button className="link" onClick={() => setQ("")}>Clear</button>
        </p>
      )}

      {msg && <p className="notice">{msg}</p>}
      <div className="grid">
        {shown.map((p) => (
          <article className="card" key={p.id}>
            <div className="thumb">
              {p.image ? <ProductImage src={p.image} alt={`${p.brand} ${p.name}`} /> : <Bottle brand={p.brand} name={p.name} size={p.size} />}
              {p.soldOut && <span className="soldout-tag">Sold out</span>}
            </div>
            <div className="meta">
              <span className="brand">{p.brand}</span>
              <h3>{p.name} · {p.size}ml</h3>
              <span className="price">{inr(p.price)}</span>
            </div>
            {p.soldOut ? (
              <button className="obtn" disabled>Sold out</button>
            ) : cart[p.id] ? (
              <div className="ostep">
                <button aria-label="Remove one" onClick={() => { setMsg(null); setQty(p.id, cart[p.id] - 1); }}>−</button>
                <span>{cart[p.id]} in cart</span>
                <button
                  aria-label="Add one"
                  onClick={() => setMsg(count >= MAX_PER_CUSTOMER ? `Maximum ${MAX_PER_CUSTOMER} miniatures per customer.` : (setQty(p.id, cart[p.id] + 1), null))}
                >+</button>
              </div>
            ) : (
              <button className="obtn" onClick={() => setMsg(add(p.id))}>Add to cart</button>
            )}
          </article>
        ))}
        {shown.length === 0 && (
          <div className="empty">
            <b>No products found</b>
            Try a different spelling, or <button className="link" onClick={reset}>clear all filters</button>.
          </div>
        )}
      </div>
      <CartDrawer products={products} />
    </>
  );
}
