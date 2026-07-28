import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ProductAccordion } from "@/components/product/product-accordion";
import { shopConfig } from "@/lib/shop/config";
import { shippingZones } from "@/lib/shop/shipping";
import { formatPrice } from "@/lib/shop/format";

export const metadata: Metadata = {
  title: "Support",
  description: "Shipping, returns, sizing and how ordering works at Reckless Lab.",
};

export default function SupportPage() {
  return (
    <div className="pb-24">
      <PageHero
        code="[ SUPPORT / HELP ]"
        title="How it works"
        tagline="Everything you need to know about ordering, shipping and returns."
      />

      <div className="container-edge grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <ProductAccordion
            sections={[
              {
                title: "How do I place an order?",
                body: (
                  <p>
                    Add pieces to your bag and head to checkout. Enter your shipping details and tap
                    &ldquo;Complete via WhatsApp&rdquo; — we generate your full order summary and open a chat with our
                    team, who confirm stock and send payment instructions. Online card & mobile-money payments are
                    coming soon.
                  </p>
                ),
              },
              {
                title: "Shipping zones & rates",
                body: (
                  <ul className="space-y-2">
                    {shippingZones.map((z) => (
                      <li key={z.id} className="flex items-center justify-between border-b border-smoke/60 pb-2">
                        <span>
                          {z.label} <span className="text-ash">· {z.estimate}</span>
                        </span>
                        <span className="text-bone">{z.rate === 0 ? "FREE" : formatPrice(z.rate)}</span>
                      </li>
                    ))}
                    <li className="pt-2 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">
                      Free worldwide shipping over {formatPrice(90)}
                    </li>
                  </ul>
                ),
              },
              {
                title: "Returns & exchanges",
                body: (
                  <p>
                    Unworn pieces can be returned within 14 days of delivery for a refund or exchange. Limited-drop
                    items are final sale. Message us on WhatsApp to start a return — we&apos;ll guide you through it.
                  </p>
                ),
              },
              {
                title: "Sizing",
                body: (
                  <p>
                    Most pieces are cut boxy and true to size — size down for a cropped, closer fit. Each product page
                    lists the specific fit and fabric weight. Still unsure? Message us your measurements and we&apos;ll
                    recommend a size.
                  </p>
                ),
              },
              {
                title: "Do you ship worldwide?",
                body: (
                  <p>
                    Yes. We ship from Banjul, The Gambia to anywhere in the world. Carrier-integrated tracking (DHL &
                    FedEx) is rolling out — for now you&apos;ll receive tracking details over WhatsApp once your order
                    ships.
                  </p>
                ),
              },
            ]}
          />
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-smoke bg-ink-soft p-6">
            <h2 className="font-display text-xl text-bone">Still need us?</h2>
            <p className="mt-3 text-sm text-fog">Our team replies fast. The quickest way to reach us is WhatsApp.</p>
            <a
              href={`https://wa.me/${shopConfig.whatsapp.number}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block bg-acid py-3.5 text-center text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${shopConfig.contact.email}`}
              className="mt-3 block border border-smoke py-3.5 text-center text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:border-bone"
            >
              {shopConfig.contact.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
