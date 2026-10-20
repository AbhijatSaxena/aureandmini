import { requireAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/store";
import { inr } from "@/lib/pricing";
import StatusSelect from "@/components/StatusSelect";

export const dynamic = "force-dynamic";

export default async function Orders() {
  await requireAdmin();
  const orders = await listOrders();
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((a, o) => a + o.total, 0);
  const profit = live.reduce((a, o) => a + o.items.reduce((s, i) => s + (i.price - i.cost) * i.qty, 0), 0);
  return (
    <div className="page wide">
      <h2>Orders</h2>
      <p className="muted">{orders.length} orders · revenue {inr(revenue)} · estimated profit {inr(profit)} (excl. cancelled)</p>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <details className="order" key={o.id}>
          <summary>
            <strong>#{o.id}</strong> · {o.customer.name} · {inr(o.total)} · {new Date(o.createdAt).toLocaleString("en-IN")}
            <span className={`pill ${o.status}`}>{o.status}</span>
          </summary>
          <div className="order-body">
            <p>
              {o.customer.phone}{o.customer.email && ` · ${o.customer.email}`}<br />
              {o.customer.address}, {o.customer.city} {o.customer.pincode}
              {o.customer.notes && <><br /><em>{o.customer.notes}</em></>}
            </p>
            {o.items.map((i) => (
              <div className="line" key={i.id}>
                <span>{i.brand} — {i.name} ({i.size}ml) × {i.qty}</span>
                <span>{inr(i.price * i.qty)} <span className="muted small">(cost {inr(i.cost * i.qty)})</span></span>
              </div>
            ))}
            <StatusSelect id={o.id} status={o.status} />
          </div>
        </details>
      ))}
    </div>
  );
}
