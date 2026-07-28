import { cn } from "@/lib/utils";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-bone md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-fog">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-smoke bg-ink-soft p-5">
      <p className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">{label}</p>
      <p className={cn("mt-3 font-display text-3xl", accent ? "text-acid" : "text-bone")}>{value}</p>
      {hint && <p className="mt-1 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-fog">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-smoke bg-ink-soft">
      <div className="flex items-center justify-between border-b border-smoke px-5 py-4">
        <h2 className="text-mono text-xs uppercase tracking-[0.25em] text-bone">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
