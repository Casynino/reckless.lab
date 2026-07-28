import { ORDER_STAGES, stageIndex, type OrderState } from "@/lib/orders/types";

const RED = "#e0342a";

/** Compact inline stage bar for an order row (6 segments). */
export function StageMini({ state }: { state: OrderState }) {
  if (state === "issue" || state === "cancelled") {
    return (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED, boxShadow: "0 0 6px rgba(224,52,42,0.5)" }} />
        <span className="text-[0.55rem] uppercase tracking-[0.2em] text-ash">{state}</span>
      </div>
    );
  }
  const current = stageIndex(state);
  return (
    <div className="mt-2 flex items-center gap-1">
      {ORDER_STAGES.map((s, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <span
            key={s.key}
            className="h-0.5 flex-1 rounded-full"
            style={{
              background: done ? "rgba(52,211,153,0.5)" : isCurrent ? RED : "var(--color-smoke)",
              boxShadow: isCurrent ? "0 0 6px rgba(224,52,42,0.5)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
