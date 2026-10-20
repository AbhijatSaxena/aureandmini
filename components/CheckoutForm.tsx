"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import CartDrawer from "./CartDrawer";
import { placeOrder } from "@/lib/actions";
import { inr } from "@/lib/pricing";
import type { Customer, PublicProduct } from "@/lib/types";

export default function CheckoutForm({ products }: { products: PublicProduct[] }) {
  const { cart, clear } = useCart();
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = Object.entries(cart).flatMap(([id, qty]) => (byId.has(id) ? [{ p: byId.get(id)!, qty }] : []));
  const total = lines.reduce((a, l) => a + l.p.price * l.qty, 0);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customer = Object.fromEntries(
      ["name", "phone", "email", "address", "city", "pincode", "notes"].map((k) => [k, String(fd.get(k) ?? "")]),
    ) as Customer;
    start(async () => {
      const res = await placeOrder(cart, customer); // redirects on success
      if (res?.error) setErr(res.error); else clear();
    });
  }

  if (lines.length === 0)
    return <div className="page"><p>Your bag is empty.</p><Link className="btn" href="/">Browse perfumes</Link></div>;

  return (
    <div className="page checkout">
      <form onSubmit={submit}>
        <h2>Delivery details</h2>
        <input name="name" placeholder="Full name" required />
        <input name="phone" placeholder="Phone / WhatsApp" inputMode="tel" required />
        <input name="email" type="email" placeholder="Email (optional)" />
        <textarea name="address" placeholder="Address" rows={3} required />
        <div className="row"><input name="city" placeholder="City" required /><input name="pincode" placeholder="Pincode" inputMode="numeric" maxLength={6} required /></div>
        <textarea name="notes" placeholder="Notes (optional)" rows={2} />
        {err && <p className="notice">{err}</p>}
        <button className="btn block" disabled={pending}>{pending ? "Placing order…" : `Place order · ${inr(total)}`}</button>
        <p className="muted small">We&apos;ll confirm stock and share payment details on WhatsApp/phone before shipping.</p>
      </form>
      <aside>
        <h2>Order summary</h2>
        {lines.map(({ p, qty }) => (
          <div className="line" key={p.id}>
            <span>{p.brand} — {p.name} ({p.size}ml) × {qty}</span><strong>{inr(p.price * qty)}</strong>
          </div>
        ))}
        <div className="row between total"><span>Total</span><strong>{inr(total)}</strong></div>
      </aside>
      <CartDrawer products={products} />
    </div>
  );
}
