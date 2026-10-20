import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "am_admin";
const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
const token = () => createHmac("sha256", secret()).update("admin-session").digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(pw: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEqual(pw, expected);
}

export async function startSession() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 14,
  });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  return !!v && safeEqual(v, token());
}
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
