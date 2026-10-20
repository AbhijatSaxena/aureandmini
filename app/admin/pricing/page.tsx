import { requireAdmin } from "@/lib/auth";
import { getConfig } from "@/lib/store";
import { allProducts } from "@/lib/pricing";
import PricingEditor from "@/components/PricingEditor";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  await requireAdmin();
  return <PricingEditor products={allProducts} initial={await getConfig()} />;
}
