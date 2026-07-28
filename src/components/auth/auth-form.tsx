"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, registerAction, type AuthState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="enter"
      className="mt-2 flex w-full items-center justify-center bg-acid py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-bone transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

const field =
  "w-full border-b border-smoke bg-transparent py-2.5 text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none";
const labelCls = "mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash";

export function AuthForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, login] = useActionState<AuthState, FormData>(loginAction, {});
  const [registerState, register] = useActionState<AuthState, FormData>(registerAction, {});
  const state = mode === "login" ? loginState : registerState;

  return (
    <div className="w-full max-w-md">
      {/* Tabs */}
      <div className="mb-8 flex border border-smoke">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 py-3 text-mono text-[0.7rem] uppercase tracking-[0.25em] transition-colors",
              mode === m ? "bg-bone text-ink" : "text-bone-dim hover:text-bone",
            )}
          >
            {m === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {mode === "login" ? (
        <form action={login} className="flex flex-col gap-5">
          {next && <input type="hidden" name="next" value={next} />}
          <div>
            <label className={labelCls} htmlFor="l-email">Email</label>
            <input id="l-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div>
            <label className={labelCls} htmlFor="l-password">Password</label>
            <input id="l-password" name="password" type="password" required autoComplete="current-password" className={field} />
          </div>
          {state.error && (
            <p className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">↳ {state.error}</p>
          )}
          <SubmitButton label="Sign In" />
        </form>
      ) : (
        <form action={register} className="flex flex-col gap-5">
          {next && <input type="hidden" name="next" value={next} />}
          <div>
            <label className={labelCls} htmlFor="r-name">Full name</label>
            <input id="r-name" name="name" type="text" required autoComplete="name" className={field} />
          </div>
          <div>
            <label className={labelCls} htmlFor="r-email">Email</label>
            <input id="r-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div>
            <label className={labelCls} htmlFor="r-password">Password</label>
            <input id="r-password" name="password" type="password" required minLength={6} autoComplete="new-password" className={field} />
            <p className="mt-1.5 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">6+ characters</p>
          </div>
          {state.error && (
            <p className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">↳ {state.error}</p>
          )}
          <SubmitButton label="Create Account" />
        </form>
      )}
    </div>
  );
}
