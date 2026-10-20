"use client";
import { useTransition } from "react";
import { updateStatus } from "@/lib/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export default function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, start] = useTransition();
  return (
    <label>Status{" "}
      <select defaultValue={status} disabled={pending} onChange={(e) => start(() => updateStatus(id, e.target.value as OrderStatus))}>
        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </label>
  );
}
