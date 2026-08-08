import { PageHero } from "@/components/layout/page-hero";

/** Shared layout for long-form legal / policy pages — hero + readable prose. */
export function LegalDoc({
  code,
  title,
  updated,
  intro,
  sections,
}: {
  code: string;
  title: string;
  updated: string;
  intro?: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
}) {
  return (
    <div className="pb-28">
      <PageHero code={code} title={title} tagline={`Last updated · ${updated}`} />
      <div className="container-edge mx-auto max-w-3xl">
        {intro && <p className="text-lg leading-relaxed text-fog">{intro}</p>}
        <div className="mt-12 space-y-12">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl uppercase tracking-tight text-bone md:text-3xl">
                <span className="mr-3 text-acid">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-fog [&_a]:text-acid [&_a]:underline [&_li]:flex [&_li]:gap-2 [&_strong]:text-bone [&_ul]:space-y-2">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bulleted list styled to the brand (acid dash markers). */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>
          <span className="text-acid">—</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
