import products from "@/data/products.json";
import type { Config, Product, PublicProduct } from "./types";

export const allProducts = products as Product[];

export const defaultConfig: Config = {
  defaultAdjust: 0,
  brandAdjust: {},
  productAdjust: {},
  images: {},
  soldOut: {},
};

export function adjustFor(p: Product, c: Config): number {
  return c.productAdjust[p.id] ?? c.brandAdjust[p.brand] ?? c.defaultAdjust;
}

// Market price adjusted by the model -> brand -> default percentage.
// Unadjusted items sell at exactly the market price; adjusted ones round to the nearest ₹5.
export function sellingPrice(p: Product, c: Config): number {
  const adj = adjustFor(p, c);
  return adj === 0 ? p.market : Math.round((p.market * (1 + adj / 100)) / 5) * 5;
}

export function toPublic(p: Product, c: Config): PublicProduct {
  return {
    id: p.id,
    category: p.category,
    brand: p.brand,
    name: p.name,
    size: p.size,
    price: sellingPrice(p, c),
    image: c.images[p.id] || undefined,
    soldOut: !!c.soldOut[p.id],
  };
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
