import products from "@/data/products.json";
import type { Config, Product, PublicProduct } from "./types";

export const allProducts = products as Product[];

export const defaultConfig: Config = {
  defaultMargin: 30,
  costBasis: "price",
  brandMargins: {},
  productMargins: {},
  images: {},
  soldOut: {},
};

export function marginFor(p: Product, c: Config): number {
  return c.productMargins[p.id] ?? c.brandMargins[p.brand] ?? c.defaultMargin;
}

export function sellingPrice(p: Product, c: Config): number {
  const cost = c.costBasis === "bulk" ? p.bulk : p.cost;
  // round up to the next multiple of 5
  return Math.ceil((cost * (1 + marginFor(p, c) / 100)) / 5) * 5;
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
