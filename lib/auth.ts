import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Firebase Hosting only forwards a cookie named __session to the backend
const COOKIE = "__session";
const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
const token = () => createHmac("sha256", secret()).update("admin-session").digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkLogin(user: string, pw: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPw = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPw) return false;
  // evaluate both so timing doesn't reveal which field was wrong
  const okUser = safeEqual(user.trim().toLowerCase(), expectedUser.toLowerCase());
  const okPw = safeEqual(pw, expectedPw);
  return okUser && okPw;
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
