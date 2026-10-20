import CheckoutForm from "@/components/CheckoutForm";
import { allProducts, toPublic } from "@/lib/pricing";
import { getConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Checkout() {
  const cfg = await getConfig();
  return <CheckoutForm products={allProducts.map((p) => toPublic(p, cfg))} />;
}
