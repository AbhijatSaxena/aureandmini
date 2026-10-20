"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MAX_PER_CUSTOMER } from "@/lib/types";

type Cart = Record<string, number>;
type Ctx = {
  cart: Cart;
  count: number;
  add: (id: string) => string | null;
  setQty: (id: string, q: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};
const C = createContext<Ctx>(null!);
export const useCart = () => useContext(C);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("am_cart") || "{}")); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) try { localStorage.setItem("am_cart", JSON.stringify(cart)); } catch {}
  }, [cart, loaded]);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const add = (id: string) => {
    if (count >= MAX_PER_CUSTOMER) return `Maximum ${MAX_PER_CUSTOMER} miniatures per customer.`;
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    return null;
  };
  const setQty = (id: string, q: number) =>
    setCart((c) => {
      const n = { ...c };
      const others = Object.entries(c).reduce((a, [k, v]) => (k === id ? a : a + v), 0);
      const qty = Math.max(0, Math.min(q, MAX_PER_CUSTOMER - others));
      if (qty <= 0) delete n[id]; else n[id] = qty;
      return n;
    });
  return (
    <C.Provider value={{ cart, count, add, setQty, clear: () => setCart({}), open, setOpen }}>
      {children}
    </C.Provider>
  );
}
