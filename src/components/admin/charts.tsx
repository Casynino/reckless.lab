import { formatPrice } from "@/lib/shop/format";
import { shopConfig } from "@/lib/shop/config";

/** Category / series colour palette. */
export const CAT_COLORS = ["#e0342a", "#34d399", "#f59e0b", "#a78bfa", "#60a5fa", "#22d3ee", "#f97316"];

const stripCurrency = (s: string) => s.replace(shopConfig.currency.symbol, "");

/** Tiny sparkline (polyline). */
export function Spark({ data, color = "#34d399" }: { data: number[]; color?: string }) {
  if (!data.length || data.every((v) => v === 0)) return <div className="h-6 w-16" />;
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 64;
  const H = 24;
  const pts = data
    .map((v, i) => `${(i / Math.max(data.length - 1, 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`)
    .join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 30-day revenue area/line chart (inline SVG, no libraries). */
export function LineChart({ data, color = "#34d399" }: { data: { date: string; amount: number }[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.amount)) || 1;
  const W = 600;
  const H = 110;
  const pts = data.map((d, i) => `${(i / Math.max(data.length - 1, 1)) * W},${H - (d.amount / max) * (H - 10) - 2}`).join(" ");
  const area = `0,${H} ${pts} ${W},${H}`;
  const nonZero = data.some((d) => d.amount > 0);
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((p) => Math.round(max * p));
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 flex h-full flex-col justify-between pr-1 text-[0.55rem] text-ash">
        {ticks.map((t, i) => (
          <span key={i}>{t > 0 ? stripCurrency(formatPrice(t)) : "0"}</span>
        ))}
      </div>
      <div className="pl-9">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
          <defs>
            <linearGradient id="rl-rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1="0" y1={H - p * (H - 10) - 2} x2={W} y2={H - p * (H - 10) - 2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          {nonZero && (
            <>
              <polygon points={area} fill="url(#rl-rev)" />
              <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
          {!nonZero && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="12" fontFamily="monospace">
              No data yet
            </text>
          )}
        </svg>
        <div className="mt-1 flex justify-between text-[0.55rem] text-ash">
          {[data[0], data[Math.floor(data.length / 4)], data[Math.floor(data.length / 2)], data[Math.floor((data.length * 3) / 4)], data[data.length - 1]]
            .filter(Boolean)
            .map((d, i) => (
              <span key={i}>{d.date.slice(5)}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

/** Donut (stacked stroke-dasharray circles). */
export function Donut({ segments }: { segments: { name: string; pct: number; color: string }[] }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  let offset = circ / 4;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="13" />
      {segments
        .filter((s) => s.pct > 0)
        .map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="13"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeOpacity="0.9"
            />
          );
          offset += dash;
          return el;
        })}
    </svg>
  );
}
