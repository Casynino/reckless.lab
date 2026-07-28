import { PageTitle, Panel } from "@/components/admin/ui";
import { shopConfig } from "@/lib/shop/config";
import { shippingZones, FREE_SHIPPING_THRESHOLD } from "@/lib/shop/shipping";
import { formatPrice } from "@/lib/shop/format";
import { getSession } from "@/lib/auth/session-cookies";
import { ProfileForm } from "@/components/account/profile-form";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-smoke/50 py-2.5 text-sm last:border-0">
      <span className="text-fog">{label}</span>
      <span className="text-bone">{value}</span>
    </div>
  );
}

export default async function AdminSettings() {
  const session = await getSession();

  return (
    <div>
      <PageTitle title="Settings" subtitle="Your profile + current store configuration." />

      {session && (
        <div className="mb-8 rounded-2xl border border-smoke bg-ink-soft p-6">
          <h2 className="mb-6 text-mono text-xs uppercase tracking-[0.25em] text-bone">My profile</h2>
          <ProfileForm name={session.name} email={session.email} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Brand">
          <Row label="Name" value={shopConfig.brand.name} />
          <Row label="Established" value={shopConfig.brand.estYear} />
          <Row label="Location" value={shopConfig.brand.locationLabel} />
          <Row label="Instagram" value={shopConfig.social.instagramHandle} />
        </Panel>

        <Panel title="Commerce">
          <Row label="Currency" value={`${shopConfig.currency.code} (${shopConfig.currency.symbol})`} />
          <Row label="WhatsApp orders" value={shopConfig.whatsapp.label} />
          <Row label="Contact email" value={shopConfig.contact.email} />
          <Row label="Free shipping over" value={formatPrice(FREE_SHIPPING_THRESHOLD)} />
        </Panel>

        <Panel title="Shipping zones">
          {shippingZones.map((z) => (
            <Row key={z.id} label={`${z.label} · ${z.estimate}`} value={z.rate === 0 ? "FREE" : formatPrice(z.rate)} />
          ))}
        </Panel>

        <Panel title="Access">
          <p className="text-sm text-fog">
            The seed admin is created on first run from <span className="text-bone">ADMIN_EMAIL</span> /{" "}
            <span className="text-bone">ADMIN_PASSWORD</span> (defaults in <span className="text-bone">.env.example</span>).
            Everyone signs in at <span className="text-acid">/login</span> — admins land here, customers land in their account.
          </p>
        </Panel>
      </div>
    </div>
  );
}
