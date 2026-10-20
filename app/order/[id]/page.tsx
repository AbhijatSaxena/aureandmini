import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { inr } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await getOrder((await params).id.toUpperCase());
  if (!order) notFound();
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  return (
    <div className="page">
      <h2>Thank you, {order.customer.name.split(" ")[0]}!</h2>
      <p>Your order <strong>#{order.id}</strong> is <strong>{order.status}</strong>. We&apos;ll contact you shortly to confirm availability and payment.</p>
      {order.items.map((i) => (
        <div className="line" key={i.id}><span>{i.brand} — {i.name} ({i.size}ml) × {i.qty}</span><strong>{inr(i.price * i.qty)}</strong></div>
      ))}
      <div className="row between total"><span>Total</span><strong>{inr(order.total)}</strong></div>
      {wa && <a className="btn" href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi! My Auré & Mini order #" + order.id)}`}>Message us on WhatsApp</a>}{" "}
      <Link className="btn ghost" href="/">Keep browsing</Link>
    </div>
  );
}
