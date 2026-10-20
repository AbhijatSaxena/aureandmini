"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export const CATS = ["All", "For Her", "For Him", "Unisex"] as const;
export type Cat = (typeof CATS)[number];

type Ctx = {
  q: string; setQ: (v: string) => void;
  cat: Cat; setCat: (v: Cat) => void;
  brand: string; setBrand: (v: string) => void;
  searchOpen: boolean; setSearchOpen: (v: boolean) => void;
};
const C = createContext<Ctx>(null!);
export const useShop = () => useContext(C);

// Shared by the header (nav + search) and the catalogue (filtering).
export default function ShopProvider({ children }: { children: ReactNode }) {
  const [q, setQ] = useState("");
  const [cat, setCatState] = useState<Cat>("All");
  const [brand, setBrand] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const setCat = (c: Cat) => { setCatState(c); setBrand(""); };
  return <C.Provider value={{ q, setQ, cat, setCat, brand, setBrand, searchOpen, setSearchOpen }}>{children}</C.Provider>;
}
