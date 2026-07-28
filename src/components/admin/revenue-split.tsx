import { Donut, CAT_COLORS } from "@/components/admin/charts";
import { formatPrice } from "@/lib/shop/format";

export interface RevenueSplitData {
  series: { name: string; pct: number; revenue: number }[];
  revenueThisMonth: number;
  revenueToday: number;
  ordersTotal: number;
  avgOrderValue: number;
  paidCount: number;
  awaitingCount: number;
  inTransitCount: number;
  deliveredCount: number;
}

/** ORA-style "Revenue & Collections" block — donut split + money-in panel. */
export function RevenueSplit({ data }: { data: RevenueSplitData }) {
  const lead = data.series[0];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Donut split */}
      <div className="rounded-2xl border border-smoke bg-ink-soft p-6">
        <h2 className="mb-6 text-sm text-bone">How this drop&rsquo;s revenue splits</h2>
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <Donut segments={data.series.map((s, i) => ({ name: s.name, pct: s.pct, color: CAT_COLORS[i % CAT_COLORS.length] }))} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl text-bone">{lead ? `${lead.pct}%` : "—"}</span>
              <span className="max-w-[70px] text-center text-[0.5rem] uppercase leading-tight tracking-[0.15em] text-ash">
                {lead ? lead.name.replace(/[‘’']/g, "") : "no sales"}
              </span>
            </div>
          </div>
          <ul className="flex-1 space-y-4">
            {data.series.map((s, i) => (
              <li key={s.name}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                  <span className="text-sm text-bone-dim">{s.name}</span>
                </div>
                <p className="mt-1 pl-4 font-display text-xl text-bone">{formatPrice(s.revenue)}</p>
                <p className="pl-4 text-[0.6rem] uppercase tracking-[0.15em] text-ash">{s.pct}% of revenue</p>
              </li>
            ))}
            {data.series.length === 0 && <li className="text-sm text-fog">No sales yet.</li>}
          </ul>
        </div>
      </div>

      {/* Money in */}
      <div className="rounded-2xl border border-smoke bg-ink-soft p-6">
        <h2 className="mb-6 text-sm text-bone">Bringing the money in</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Metric label="Revenue this month" value={formatPrice(data.revenueThisMonth)} color="text-emerald-400" />
          <Metric label="Collected today" value={formatPrice(data.revenueToday)} color="text-cyan-400" />
          <Metric label="Avg order value" value={formatPrice(data.avgOrderValue)} color="text-violet-400" />
          <Metric label="Total orders" value={String(data.ordersTotal)} color="text-sky-400" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-smoke pt-5 text-center">
          <Pill n={data.awaitingCount} label="awaiting" color="text-amber-400" />
          <Pill n={data.inTransitCount} label="in transit" color="text-violet-400" />
          <Pill n={data.deliveredCount} label="delivered" color="text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-ash">{label}</p>
      <p className={`mt-1 font-display text-2xl ${color}`}>{value}</p>
    </div>
  );
}

function Pill({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div>
      <p className={`font-display text-xl ${color}`}>{n}</p>
      <p className="text-[0.55rem] uppercase tracking-[0.15em] text-ash">{label}</p>
    </div>
  );
}
