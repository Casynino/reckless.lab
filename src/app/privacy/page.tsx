import type { Metadata } from "next";
import { shopConfig } from "@/lib/shop/config";
import { LegalDoc, LegalList } from "@/components/layout/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Reckless Laboratory collects, uses and protects your information.",
};

const UPDATED = "8 August 2026";

export default function PrivacyPage() {
  const { brand, contact, whatsapp } = shopConfig;
  return (
    <LegalDoc
      code="[ LEGAL / PRIVACY ]"
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <>
          {brand.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what we collect
          when you use {brand.name}, why we collect it, and the control you have over it. We keep it plain because your
          data should never be a mystery.
        </>
      }
      sections={[
        {
          heading: "Who we are",
          body: (
            <p>
              {brand.name} is an independent fashion label based in {brand.locationLabel.split(" ")[0]}, The Gambia,
              shipping worldwide. For any privacy question, reach us at{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> or on WhatsApp at {whatsapp.label}.
            </p>
          ),
        },
        {
          heading: "What we collect",
          body: (
            <>
              <p>We only collect what we need to run the store and fulfil your order:</p>
              <LegalList
                items={[
                  <><strong>Order details</strong> — your name, email, phone number and delivery address.</>,
                  <><strong>Account details</strong> — your name and email, plus a password stored only as a secure one-way hash (we never see it).</>,
                  <><strong>Order &amp; support history</strong> — the pieces you buy, tracking status, and any messages you send us.</>,
                  <><strong>Newsletter</strong> — your email, only if you choose to subscribe.</>,
                  <><strong>Essential technical data</strong> — a sign-in session cookie, and your cart/wishlist which live in your own browser.</>,
                ]}
              />
              <p>
                <strong>We do not collect or store your card or bank details.</strong> Payment is arranged directly with
                our team over WhatsApp, so no payment credentials ever pass through this website.
              </p>
            </>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <LegalList
              items={[
                "Process, confirm and deliver your orders, and let you track them.",
                "Give you an account with your order history and saved addresses.",
                "Reply to your support messages.",
                "Send you drop news and offers — only if you opt in, and you can leave any time.",
                "Prevent fraud and keep the store secure, and improve how it works.",
              ]}
            />
          ),
        },
        {
          heading: "Who we share it with",
          body: (
            <>
              <p>We never sell your data. We share it only with the partners that make the store run:</p>
              <LegalList
                items={[
                  <><strong>Hosting &amp; database</strong> — the infrastructure that securely runs the site and stores your account.</>,
                  <><strong>Couriers</strong> — DHL Express and local delivery partners, to ship your order.</>,
                  <><strong>WhatsApp</strong> — to confirm stock, shipping and payment when you complete an order.</>,
                ]}
              />
              <p>We may also disclose information where the law requires it.</p>
            </>
          ),
        },
        {
          heading: "Cookies & your browser",
          body: (
            <p>
              We use a single essential cookie to keep you signed in. Your cart and wishlist are stored locally on your
              own device, not on our servers. We do <strong>not</strong> run third-party advertising or cross-site
              tracking.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <LegalList
              items={[
                "View and update your name, email and addresses any time from your account.",
                "Unsubscribe from the newsletter using the link in any email, or by contacting us.",
                <>Ask us to access or delete your personal data by emailing <a href={`mailto:${contact.email}`}>{contact.email}</a>.</>,
              ]}
            />
          ),
        },
        {
          heading: "Keeping it safe",
          body: (
            <p>
              Passwords are hashed, connections are encrypted, and access is limited. We keep your information only as
              long as we need it to provide your orders and account, or as the law requires.
            </p>
          ),
        },
        {
          heading: "Children",
          body: <p>{brand.name} is not directed at children under 16, and we do not knowingly collect their data.</p>,
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              We may update this policy as the store evolves. The date at the top always reflects the latest version.
              Material changes will be highlighted on the site.
            </p>
          ),
        },
      ]}
    />
  );
}
