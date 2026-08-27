import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { shopConfig } from "@/lib/shop/config";
import { maintenance } from "@/lib/shop/maintenance";

/**
 * The dark-store screen. Deliberately bare: no header, no nav, nothing that
 * links back into a storefront that isn't serving. Just the mark, the reason,
 * the ETA, and the channels that still work.
 *
 * Server-rendered with CSS-only motion — a customer on a slow phone sees the
 * message on first paint instead of waiting for a JS bundle to reveal it.
 */
export function MaintenanceScreen() {
  const wa = `https://wa.me/${shopConfig.whatsapp.number}`;
  const link =
    "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:text-acid";

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-6 py-10 md:px-12 md:py-14">
      {/* Slow acid bloom behind the type — the only ambient motion here. */}
      <div
        aria-hidden
        className="rl-bloom pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmax] w-[70vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-acid) 14%, transparent) 0%, transparent 62%)",
        }}
      />

      <header className="rl-rise flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ash sm:text-[11px] sm:tracking-[0.28em]">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
        </span>
        <span className="whitespace-nowrap">{shopConfig.brand.name}</span>
        <span className="text-smoke">/</span>
        <span className="whitespace-nowrap">EST {shopConfig.brand.est}</span>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-16">
        <p
          className="rl-rise font-mono text-[11px] uppercase tracking-[0.32em] text-acid"
          style={{ animationDelay: "80ms" }}
        >
          Store offline
        </p>

        <h1
          className="rl-rise mt-5 font-display text-[clamp(2.6rem,9vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-bone"
          style={{ animationDelay: "160ms" }}
        >
          {maintenance.headline}
        </h1>

        {/* Indeterminate sweep: work is happening; we're not claiming how much. */}
        <div
          className="rl-rise relative mt-8 h-px w-full overflow-hidden bg-smoke"
          style={{ animationDelay: "240ms" }}
        >
          <span aria-hidden className="rl-sweep absolute inset-y-0 w-1/3 bg-acid" />
        </div>

        <p
          className="rl-rise mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg"
          style={{ animationDelay: "320ms" }}
        >
          {maintenance.body}
        </p>

        <p
          className="rl-rise mt-8 inline-flex w-fit items-center gap-3 border border-smoke px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim"
          style={{ animationDelay: "400ms" }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
          {maintenance.eta}
        </p>
      </main>

      <footer
        className="rl-rise flex flex-col gap-4 border-t border-smoke pt-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "480ms" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
          Already ordered? We&rsquo;re still on WhatsApp.
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={wa} target="_blank" rel="noreferrer" className={link}>
            <MessageCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            {shopConfig.whatsapp.label}
          </a>
          <a href={shopConfig.social.instagram} target="_blank" rel="noreferrer" className={link}>
            {shopConfig.social.instagramHandle}
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          </a>
          <a href={`mailto:${shopConfig.contact.email}`} className={link}>
            <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            {shopConfig.contact.email}
          </a>
        </nav>
      </footer>
    </div>
  );
}
