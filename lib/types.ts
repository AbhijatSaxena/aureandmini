export type Product = {
  id: string;
  category: "Unisex" | "For Him" | "For Her";
  brand: string;
  name: string;
  size: number;
  market: number; // market price from the price list
  cost: number; // purchase price (bulk price) from the price list
};

export type Config = {
  defaultAdjust: number; // % on top of market price (negative = discount)
  brandAdjust: Record<string, number>;
  productAdjust: Record<string, number>;
  images: Record<string, string>;
  soldOut: Record<string, boolean>;
};

export type PublicProduct = {
  id: string;
  category: Product["category"];
  brand: string;
  name: string;
  size: number;
  price: number;
  image?: string;
  soldOut: boolean;
};

export const ORDER_STATUSES = ["new", "confirmed", "paid", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: Customer;
  items: { id: string; brand: string; name: string; size: number; qty: number; price: number; cost: number }[];
  total: number;
};

export const MAX_PER_CUSTOMER = 7;
