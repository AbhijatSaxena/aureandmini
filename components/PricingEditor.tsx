"use client";
import { useMemo, useState, useTransition } from "react";
import { savePricing } from "@/lib/actions";
import { inr, marginFor, sellingPrice } from "@/lib/pricing";
import type { Config, Product } from "@/lib/types";

const parse = (v: string) => (v.trim() === "" || isNaN(Number(v)) ? undefined : Number(v));

export default function PricingEditor({ products, initial }: { products: Product[]; initial: Config }) {
  const [cfg, setCfg] = useState<Config>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("");

  const brands = useMemo(() => {
    const m = new Map<string, Product[]>();
    for (const p of products) m.set(p.brand, [...(m.get(p.brand) ?? []), p]);
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const touch = (f: (c: Config) => Config) => { setCfg(f); setSaved(false); };
  const setMap = (key: "brandMargins" | "productMargins", k: string, v: number | undefined) =>
    touch((c) => {
      const m = { ...c[key] };
      if (v === undefined) delete m[k]; else m[k] = v;
      return { ...c, [key]: m };
    });

  return (
    <div className="page wide pricing">
      <h2>Pricing &amp; margins</h2>
      <p className="muted">
        Selling price = cost × (1 + margin%), rounded up to the next ₹5. Margin priority: <strong>model</strong> → <strong>brand</strong> → <strong>default</strong>. Leave a field blank to inherit.
      </p>
      <div className="row settings">
        <label>Default margin %
          <input type="number" value={cfg.defaultMargin} onChange={(e) => touch((c) => ({ ...c, defaultMargin: parse(e.target.value) ?? 0 }))} />
        </label>
        <label>Cost basis
          <select value={cfg.costBasis} onChange={(e) => touch((c) => ({ ...c, costBasis: e.target.value as Config["costBasis"] }))}>
            <option value="price">Price (₹) column</option>
            <option value="bulk">Bulk Disc. Price (₹) column</option>
          </select>
        </label>
        <input placeholder="Filter brand / model…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button className="btn" disabled={pending} onClick={() => start(async () => { await savePricing(cfg); setSaved(true); })}>
          {pending ? "Saving…" : "Save all changes"}
        </button>
        {saved && <span className="ok">Saved ✓</span>}
      </div>

      {brands.map(([brand, list]) => {
        const rows = list.filter((p) => `${brand} ${p.name}`.toLowerCase().includes(filter.toLowerCase()));
        if (!rows.length) return null;
        return (
          <section key={brand} className="brandblock">
            <div className="row between brandhead">
              <h3>{brand} <span className="muted small">({list.length})</span></h3>
              <label>Brand margin %
                <input type="number" placeholder={String(cfg.defaultMargin)} value={cfg.brandMargins[brand] ?? ""}
                  onChange={(e) => setMap("brandMargins", brand, parse(e.target.value))} />
              </label>
            </div>
            <table>
              <thead><tr><th>Model</th><th>ml</th><th>Cost</th><th>Margin %</th><th>Sell</th><th>Profit</th><th>Image URL</th><th>Sold out</th></tr></thead>
              <tbody>
                {rows.map((p) => {
                  const cost = cfg.costBasis === "bulk" ? p.bulk : p.cost;
                  const sell = sellingPrice(p, cfg);
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>{p.size}</td><td>{inr(cost)}</td>
                      <td><input type="number" placeholder={String(marginFor({ ...p }, { ...cfg, productMargins: {} }))} value={cfg.productMargins[p.id] ?? ""}
                        onChange={(e) => setMap("productMargins", p.id, parse(e.target.value))} /></td>
                      <td><strong>{inr(sell)}</strong></td><td>{inr(sell - cost)}</td>
                      <td><input className="url" placeholder="https://…" value={cfg.images[p.id] ?? ""}
                        onChange={(e) => touch((c) => ({ ...c, images: { ...c.images, [p.id]: e.target.value } }))} /></td>
                      <td><input type="checkbox" checked={!!cfg.soldOut[p.id]}
                        onChange={(e) => touch((c) => ({ ...c, soldOut: { ...c.soldOut, [p.id]: e.target.checked } }))} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
