"use client";
import { useMemo, useState, useTransition } from "react";
import { savePricing } from "@/lib/actions";
import { adjustFor, inr, sellingPrice } from "@/lib/pricing";
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
  const setMap = (key: "brandAdjust" | "productAdjust", k: string, v: number | undefined) =>
    touch((c) => {
      const m = { ...c[key] };
      if (v === undefined) delete m[k]; else m[k] = v;
      return { ...c, [key]: m };
    });

  return (
    <div className="page wide pricing">
      <h2>Pricing</h2>
      <p className="muted">
        Selling price starts at the <strong>market price</strong> from your price list. Add a <strong>+ / − adjustment %</strong> on top (e.g. −10 = 10% below market).
        Priority: <strong>model</strong> → <strong>brand</strong> → <strong>default</strong>; leave blank to inherit. Adjusted prices round to the nearest ₹5.
        Margin is measured against your purchase cost.
      </p>
      <div className="row settings">
        <label>Default adjustment %
          <input type="number" value={cfg.defaultAdjust} onChange={(e) => touch((c) => ({ ...c, defaultAdjust: parse(e.target.value) ?? 0 }))} />
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
              <label>Brand adjustment %
                <input type="number" placeholder={String(cfg.defaultAdjust)} value={cfg.brandAdjust[brand] ?? ""}
                  onChange={(e) => setMap("brandAdjust", brand, parse(e.target.value))} />
              </label>
            </div>
            <table>
              <thead><tr><th>Model</th><th>ml</th><th>Market</th><th>Cost</th><th>Adj %</th><th>Sell</th><th>Profit</th><th>Margin</th><th>Image URL</th><th>Sold out</th></tr></thead>
              <tbody>
                {rows.map((p) => {
                  const sell = sellingPrice(p, cfg);
                  const profit = sell - p.cost;
                  const inherited = adjustFor(p, { ...cfg, productAdjust: {} });
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>{p.size}</td><td>{inr(p.market)}</td><td>{inr(p.cost)}</td>
                      <td><input type="number" placeholder={String(inherited)} value={cfg.productAdjust[p.id] ?? ""}
                        onChange={(e) => setMap("productAdjust", p.id, parse(e.target.value))} /></td>
                      <td><strong>{inr(sell)}</strong></td>
                      <td className={profit < 0 ? "loss" : ""}>{inr(profit)}</td>
                      <td className={profit < 0 ? "loss" : ""}>{((profit / sell) * 100).toFixed(0)}%</td>
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
