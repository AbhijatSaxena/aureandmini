import Catalog from "@/components/Catalog";
import { allProducts, toPublic } from "@/lib/pricing";
import { getConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cfg = await getConfig();
  return <Catalog products={allProducts.map((p) => toPublic(p, cfg))} />;
}
