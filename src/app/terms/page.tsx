import type { Metadata } from "next";
import { shopConfig } from "@/lib/shop/config";
import { LegalDoc, LegalList } from "@/components/layout/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you shop with Reckless Laboratory.",
};

const UPDATED = "8 August 2026";

export default function TermsPage() {
  const { brand, contact, whatsapp, currency } = shopConfig;
  return (
    <LegalDoc
      code="[ LEGAL / TERMS ]"
      title="Terms of Service"
      updated={UPDATED}
      intro={
        <>
          These terms cover your use of {brand.name} and any order you place with us. By browsing the site or placing an
          order, you agree to them. If anything here isn&apos;t clear, message us before you buy.
        </>
      }
      sections={[
        {
          heading: "How ordering works",
          body: (
            <>
              <p>
                You browse, build a bag and check out. Checkout generates your order reference and tracking number and
                opens a WhatsApp chat with our team, who confirm stock, finalise any shipping still marked
                &ldquo;to be confirmed&rdquo;, and send payment instructions.
              </p>
              <p>
                An order is only <strong>confirmed once we have verified availability and received payment</strong>.
                Until then it is a request, not a binding sale. We may decline or cancel an order — for example if an
                item is out of stock or a price was listed in error — and will refund anything already paid.
              </p>
            </>
          ),
        },
        {
          heading: "Pricing & availability",
          body: (
            <p>
              Prices are shown in {currency.code} and may change at any time. Pieces are produced in limited runs and can
              sell out. We take care to price and describe everything accurately; if a genuine error slips through, we
              may correct it and will let you know before charging you.
            </p>
          ),
        },
        {
          heading: "Shipping & delivery",
          body: (
            <>
              <p>Shipping is calculated at checkout based on your destination and order value:</p>
              <LegalList
                items={[
                  "Free shipping on orders over $100 to our supported markets.",
                  "Flat rates apply to the United States, Canada, Tanzania, China and The Gambia (free within The Gambia).",
                  "For other countries, shipping is confirmed by our team after checkout, before any payment.",
                ]}
              />
              <p>Delivery estimates are guidance, not guarantees — couriers and customs can affect timing.</p>
            </>
          ),
        },
        {
          heading: "Returns & exchanges",
          body: (
            <p>
              We accept returns on unworn, unwashed pieces in their original condition within{" "}
              <strong>14 days</strong> of delivery. Message us first at{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> or on WhatsApp ({whatsapp.label}) to start a return
              or exchange. Return shipping is arranged case by case.
            </p>
          ),
        },
        {
          heading: "Your account",
          body: (
            <p>
              You&apos;re responsible for keeping your login details private and for activity on your account. Give us
              accurate information, and let us know if you suspect unauthorised use. We may suspend accounts used for
              fraud or abuse.
            </p>
          ),
        },
        {
          heading: "Reviews & posted content",
          body: (
            <p>
              You keep ownership of reviews and content you post, but grant us permission to display and share them in
              connection with the store. Content must be truthful, your own, and lawful — we may edit or remove anything
              that isn&apos;t.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The {brand.name} name, logo, designs, graphics, photography and copy are ours or used with permission. You
              may not copy, resell or reproduce them without our written consent.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <p>
              Don&apos;t use the site for anything unlawful, don&apos;t attempt to disrupt or scrape it, and don&apos;t
              interfere with other people&apos;s use of it.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              The site and products are provided in good faith. To the fullest extent permitted by law, our liability for
              any order is limited to the amount you paid for it. Nothing here removes rights you have under applicable
              consumer law.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: <p>These terms are governed by the laws of The Gambia.</p>,
        },
        {
          heading: "Changes & contact",
          body: (
            <p>
              We may update these terms; the date at the top reflects the latest version. Questions? Email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> or message us on WhatsApp.
            </p>
          ),
        },
      ]}
    />
  );
}
