"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, changePasswordAction, type AuthState } from "@/lib/auth/actions";

const field =
  "w-full border-b border-smoke bg-transparent py-2.5 text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none";
const labelCls = "mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash";

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit bg-bone px-6 py-2.5 text-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-acid hover:text-bone disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Status({ state, okText }: { state: AuthState; okText: string }) {
  if (state.error) return <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">↳ {state.error}</span>;
  if (state.ok) return <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-emerald-400">✳ {okText}</span>;
  return null;
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [profile, saveProfile] = useActionState<AuthState, FormData>(updateProfileAction, {});
  const [pw, savePw] = useActionState<AuthState, FormData>(changePasswordAction, {});

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Identity */}
      <form action={saveProfile} className="flex flex-col gap-4">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Your details</p>
        <div>
          <label className={labelCls} htmlFor="p-name">Full name</label>
          <input id="p-name" name="name" defaultValue={name} required className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-email">Email</label>
          <input id="p-email" name="email" type="email" defaultValue={email} required className={field} />
        </div>
        <div className="mt-1 flex items-center gap-4">
          <Save label="Save details" />
          <Status state={profile} okText="Saved" />
        </div>
      </form>

      {/* Password */}
      <form action={savePw} className="flex flex-col gap-4">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Change password</p>
        <div>
          <label className={labelCls} htmlFor="p-current">Current password</label>
          <input id="p-current" name="current" type="password" autoComplete="current-password" required className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-next">New password</label>
          <input id="p-next" name="next" type="password" autoComplete="new-password" minLength={6} required className={field} />
        </div>
        <div className="mt-1 flex items-center gap-4">
          <Save label="Update password" />
          <Status state={pw} okText="Updated" />
        </div>
      </form>
    </div>
  );
}
