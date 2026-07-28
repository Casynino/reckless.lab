"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { trackOrderAction } from "@/lib/orders/track-action";
import { OrderDetail } from "./order-detail";
import type { Order } from "@/lib/orders/types";

export function TrackClient({ initialRef = "", initialTrk = "" }: { initialRef?: string; initialTrk?: string }) {
  const [reference, setReference] = useState(initialRef);
  const [tracking, setTracking] = useState(initialTrk);
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auto = useRef(false);

  async function lookup(refv: string, trkv: string, mail?: string) {
    setError("");
    setLoading(true);
    setOrder(null);
    const res = await trackOrderAction({ reference: refv, tracking: trkv, email: mail || undefined });
    setLoading(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setOrder(res.order);
  }

  useEffect(() => {
    if (!auto.current && initialRef && initialTrk) {
      auto.current = true;
      lookup(initialRef, initialTrk);
    }
  }, [initialRef, initialTrk]);

  return (
    <div className="container-edge pb-28">
      {/* Lookup form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(reference, tracking, email);
        }}
        className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2"
      >
        <Field label="Order number" placeholder="RL-XXXXXX" value={reference} onChange={setReference} required />
        <Field label="Tracking number" placeholder="RL-XXXX-XXXX" value={tracking} onChange={setTracking} required />
        <div className="md:col-span-2">
          <Field label="Email (optional)" placeholder="For extra verification" value={email} onChange={setEmail} type="email" />
        </div>
        <div className="md:col-span-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-acid py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Locating…" : "Track order"}
          </motion.button>
          {error && <p className="mt-3 text-center text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{error}</p>}
        </div>
      </form>

      {/* Result */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 border-t border-smoke pt-16"
        >
          <OrderDetail order={order} />
        </motion.div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
        {label}
        {required && <span className="text-acid"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-smoke bg-transparent py-2.5 uppercase text-bone placeholder:normal-case placeholder:text-ash/60 focus:border-bone focus:outline-none"
      />
    </div>
  );
}
