"use client";
import Link from "next/link";
import Bottle from "./Bottle";
import { useCart } from "./CartProvider";
import { inr } from "@/lib/pricing";
import type { PublicProduct } from "@/lib/types";

export default function CartDrawer({ products }: { products: PublicProduct[] }) {
  const { cart, setQty, open, setOpen, count } = useCart();
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = Object.entries(cart).flatMap(([id, qty]) => (byId.has(id) ? [{ p: byId.get(id)!, qty }] : []));
  const total = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  if (!open) return null;
  return (
    <div className="overlay" onClick={() => setOpen(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="row between"><h2>Your cart</h2><button className="link" onClick={() => setOpen(false)}>Close</button></div>
        {lines.length === 0 && <p className="muted">Your cart is empty.</p>}
        {lines.map(({ p, qty }) => (
          <div className="line" key={p.id}>
            <div className="lt">
              {p.image ? <img src={p.image} alt="" width={56} height={72} /> : <Bottle brand={p.brand} name={p.name} size={p.size} />}
            </div>
            <div className="li"><strong>{p.brand}</strong><br />{p.name} · {p.size}ml<br /><span className="muted">{inr(p.price)}</span></div>
            <div className="qty">
              <button onClick={() => setQty(p.id, qty - 1)}>−</button><span>{qty}</span><button onClick={() => setQty(p.id, qty + 1)}>+</button>
            </div>
          </div>
        ))}
        {lines.length > 0 && (
          <>
            <div className="row between total"><span>Total ({count} pcs)</span><strong>{inr(total)}</strong></div>
            <Link href="/checkout" className="btn block" onClick={() => setOpen(false)}>Checkout</Link>
          </>
        )}
        <p className="muted small">Maximum 7 miniatures per customer. All pieces subject to availability.</p>
      </aside>
    </div>
  );
}
