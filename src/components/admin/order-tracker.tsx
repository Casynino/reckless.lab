"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Package,
  PackageCheck,
  Truck,
  Home,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { ORDER_STAGES, stageIndex, type OrderState, type OrderEvent, STATE_META } from "@/lib/orders/types";

const STAGE_ICONS = [ShoppingBag, CreditCard, Package, PackageCheck, Truck, Home];

const RED = "#e0342a"; // Reckless signal — the "current/live" stage
const GREEN = "rgba(52,211,153,0.9)";

/**
 * Animated order tracking timeline. Completed nodes glow green, the current
 * node pulses red (with a ping + glow), future nodes stay faded. The connecting
 * line grows to the current stage, in Reckless's ink + red language.
 */
export function OrderTracker({
  state,
  history,
  tracking,
}: {
  state: OrderState;
  history?: OrderEvent[];
  tracking?: string;
}) {
  const isException = state === "issue" || state === "cancelled";
  const current = stageIndex(state); // -1 for exception
  const pct = isException
    ? 25
    : current < 0
      ? 2
      : Math.round((current / (ORDER_STAGES.length - 1)) * 100);

  return (
    <div className="relative overflow-hidden border border-smoke bg-ink p-5 text-mono">
      {/* dotted grid bg + scan line */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="animate-tracker-scan pointer-events-none absolute inset-x-0 z-10 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(224,52,42,0.35), transparent)" }}
      />

      {/* header */}
      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">Tracking</p>
          <p
            className="mt-1 text-sm font-bold tracking-wide"
            style={{ color: RED, textShadow: "0 0 16px rgba(224,52,42,0.4)" }}
          >
            {tracking ?? "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">
            {isException ? "Status" : `Stage ${Math.max(current + 1, 0)} of ${ORDER_STAGES.length}`}
          </p>
          <p className="mt-1 text-sm text-bone">{STATE_META[state].label}</p>
        </div>
      </div>

      {/* header progress bar */}
      <div className="relative z-10 mb-6 h-px w-full bg-smoke">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: isException ? RED : "linear-gradient(90deg, #34d399, #e0342a)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
        />
      </div>

      {isException ? (
        <div className="relative z-10 flex items-center gap-3 py-3">
          {state === "cancelled" ? (
            <XCircle className="h-6 w-6" style={{ color: RED }} />
          ) : (
            <RefreshCw className="h-6 w-6 animate-spin" style={{ color: RED }} />
          )}
          <div>
            <p className="text-sm text-bone">{STATE_META[state].label}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.13em] text-ash">Needs attention</p>
          </div>
        </div>
      ) : (
        /* timeline */
        <div className="relative z-10 flex items-start justify-between px-2">
          {/* static track */}
          <div className="absolute inset-x-4 top-3.5 h-px bg-smoke" />
          {/* animated fill */}
          <motion.div
            className="absolute left-4 top-3.5 h-px"
            style={{ background: `linear-gradient(90deg, ${GREEN}, ${RED})`, right: 16 }}
            initial={{ width: "0%" }}
            animate={{ width: current < 0 ? "0%" : `${Math.min(100, (current / (ORDER_STAGES.length - 1)) * 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />

          {ORDER_STAGES.map((stage, i) => {
            const Icon = STAGE_ICONS[i] ?? Package;
            const completed = current > i;
            const isCurrent = current === i;
            return (
              <div key={stage.key} className="relative z-10 flex flex-1 flex-col items-center gap-2">
                <div
                  className="relative flex h-7 w-7 items-center justify-center border transition-all duration-300"
                  style={{
                    borderColor: isCurrent ? RED : completed ? "rgba(52,211,153,0.55)" : "var(--color-smoke)",
                    background: isCurrent ? "rgba(224,52,42,0.12)" : completed ? "rgba(52,211,153,0.08)" : "transparent",
                    boxShadow: isCurrent ? "0 0 10px rgba(224,52,42,0.45)" : "none",
                  }}
                >
                  {completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "rgba(52,211,153,0.85)" }} />
                  ) : (
                    <Icon className="h-3 w-3" style={{ color: isCurrent ? RED : "var(--color-ash)" }} />
                  )}
                  {isCurrent && (
                    <span
                      className="animate-tracker-ping absolute inset-0"
                      style={{ background: "rgba(224,52,42,0.12)" }}
                    />
                  )}
                </div>
                <p
                  className="max-w-[52px] text-center text-[0.55rem] uppercase leading-tight tracking-wide"
                  style={{
                    color: isCurrent ? RED : completed ? "var(--color-bone-dim)" : "var(--color-ash)",
                  }}
                >
                  {stage.short}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* event log */}
      {history && history.length > 0 && (
        <div className="relative z-10 mt-6 border-t border-smoke/60 pt-4">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-ash">Updates</p>
          <ul className="space-y-2">
            {[...history].reverse().map((e, i) => (
              <li key={i} className="flex items-center gap-3 text-xs">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATE_META[e.state].dot}`} />
                <span className="text-bone-dim">{STATE_META[e.state].label}</span>
                <span className="ml-auto text-[0.7rem] uppercase tracking-[0.15em] text-ash">
                  {new Date(e.at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
