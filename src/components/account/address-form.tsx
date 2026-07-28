"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveAddressAction, type AuthState } from "@/lib/auth/actions";
import { shippingCountries } from "@/lib/shop/shipping";
import type { Address } from "@/lib/auth/types";

const field =
  "w-full border-b border-smoke bg-transparent py-2.5 text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none";
const labelCls = "mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-fit bg-bone px-8 py-3.5 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-acid hover:text-bone disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save address"}
    </button>
  );
}

export function AddressForm({ address }: { address?: Address }) {
  const [state, action] = useActionState<AuthState, FormData>(saveAddressAction, {});

  return (
    <form action={action} className="grid grid-cols-2 gap-4">
      <Input name="fullName" label="Full name" defaultValue={address?.fullName} span2 required />
      <Input name="phone" label="Phone (WhatsApp)" defaultValue={address?.phone} span2 required />
      <Input name="address1" label="Address" defaultValue={address?.address1} span2 required />
      <Input name="address2" label="Apartment, suite (optional)" defaultValue={address?.address2} span2 />
      <Input name="city" label="City" defaultValue={address?.city} required />
      <Input name="region" label="Region / State" defaultValue={address?.region} />
      <Input name="postalCode" label="Postal code" defaultValue={address?.postalCode} />
      <div>
        <label className={labelCls}>Country</label>
        <select
          name="countryCode"
          defaultValue={address?.countryCode ?? "GM"}
          className="w-full border-b border-smoke bg-ink py-2.5 text-bone focus:border-bone focus:outline-none"
        >
          {shippingCountries.map((c) => (
            <option key={c.code} value={c.code} className="bg-ink">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 flex items-center gap-4">
        <SaveButton />
        {state.error ? (
          <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">↳ {state.error}</span>
        ) : state.ok ? (
          <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">✳ Saved</span>
        ) : null}
      </div>
    </form>
  );
}

function Input({
  name,
  label,
  defaultValue,
  span2,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  span2?: boolean;
  required?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : "col-span-1"}>
      <label className={labelCls} htmlFor={`addr-${name}`}>
        {label}
      </label>
      <input id={`addr-${name}`} name={name} defaultValue={defaultValue} required={required} className={field} />
    </div>
  );
}
