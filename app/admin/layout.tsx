import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions";

export const metadata = { title: "Admin — Auré & Mini", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="admin">
      {authed && (
        <nav className="row between">
          <span><Link href="/admin">Orders</Link> · <Link href="/admin/pricing">Pricing &amp; margins</Link> · <Link href="/">View store</Link></span>
          <form action={logout}><button className="link">Sign out</button></form>
        </nav>
      )}
      {children}
    </div>
  );
}
