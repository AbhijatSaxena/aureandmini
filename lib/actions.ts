"use server";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { allProducts, sellingPrice } from "./pricing";
import { checkLogin, endSession, requireAdmin, startSession } from "./auth";
import { createOrder, getConfig, saveConfig, setOrderStatus } from "./store";
import { MAX_PER_CUSTOMER, ORDER_STATUSES, type Config, type Customer, type Order, type OrderStatus } from "./types";

export async function placeOrder(
  cart: Record<string, number>,
  customer: Customer,
): Promise<{ error: string } | never> {
  const c: Customer = {
    name: customer.name.trim().slice(0, 100),
    phone: customer.phone.replace(/[^\d+]/g, "").slice(0, 15),
    email: customer.email.trim().slice(0, 120),
    address: customer.address.trim().slice(0, 300),
    city: customer.city.trim().slice(0, 60),
    pincode: customer.pincode.trim().slice(0, 10),
    notes: customer.notes.trim().slice(0, 300),
  };
  if (!c.name || c.phone.length < 10 || !c.address || !c.city || !/^\d{6}$/.test(c.pincode))
    return { error: "Please fill in name, a valid phone, address, city and 6-digit pincode." };

  const cfg = await getConfig();
  const items: Order["items"] = [];
  for (const [id, raw] of Object.entries(cart)) {
    const p = allProducts.find((x) => x.id === id);
    const qty = Math.floor(Number(raw));
    if (!p || !(qty > 0)) continue;
    if (cfg.soldOut[id]) return { error: `${p.brand} ${p.name} is sold out.` };
    items.push({
      id, brand: p.brand, name: p.name, size: p.size, qty,
      price: sellingPrice(p, cfg), // price always recomputed on the server
      cost: p.cost,
    });
  }
  if (!items.length) return { error: "Your bag is empty." };
  if (items.reduce((a, i) => a + i.qty, 0) > MAX_PER_CUSTOMER)
    return { error: `Maximum ${MAX_PER_CUSTOMER} miniatures per customer.` };

  const order: Order = {
    id: randomBytes(5).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "new",
    customer: c,
    items,
    total: items.reduce((a, i) => a + i.price * i.qty, 0),
  };
  await createOrder(order);
  redirect(`/order/${order.id}`);
}

export async function login(_: unknown, fd: FormData): Promise<{ error: string } | undefined> {
  if (!checkLogin(String(fd.get("username") ?? ""), String(fd.get("password") ?? ""))) return { error: "Wrong username or password." };
  await startSession();
  redirect("/admin");
}
export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function updateStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return;
  await setOrderStatus(id, status);
  revalidatePath("/admin");
}

export async function savePricing(cfg: Config) {
  await requireAdmin();
  const clean = <T,>(o: Record<string, T>, ok: (v: T) => boolean) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => ok(v)));
  const num = (v: number) => typeof v === "number" && Number.isFinite(v) && v > -90 && v < 500;
  const prev = await getConfig();
  await saveConfig({
    defaultAdjust: num(cfg.defaultAdjust) ? cfg.defaultAdjust : prev.defaultAdjust,
    brandAdjust: clean(cfg.brandAdjust, num),
    productAdjust: clean(cfg.productAdjust, num),
    images: clean(cfg.images, (v) => typeof v === "string" && /^https?:\/\//.test(v)),
    soldOut: clean(cfg.soldOut, Boolean),
  });
  revalidatePath("/");
  revalidatePath("/admin/pricing");
}
