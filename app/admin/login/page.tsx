"use client";
import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="page narrow">
      <h2>Admin sign in</h2>
      <input name="username" placeholder="Username" autoComplete="username" autoFocus required />
      <input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
      {state?.error && <p className="notice">{state.error}</p>}
      <button className="btn" disabled={pending}>Sign in</button>
    </form>
  );
}
