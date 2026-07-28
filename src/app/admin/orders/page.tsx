import { PageTitle, Panel } from "@/components/admin/ui";
import { shopConfig } from "@/lib/shop/config";

export const dynamic = "force-dynamic";

export default function AdminOrders() {
  return (
    <div>
      <PageTitle title="Orders" subtitle="Order capture arrives with online payments." />

      <div className="border border-smoke bg-ink-soft p-10 text-center">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-acid">WhatsApp checkout</p>
        <p className="mx-auto mt-4 max-w-md text-fog">
          Right now every order is completed over WhatsApp — the checkout builds a full itemised summary and opens
          a chat to <span className="text-bone">{shopConfig.whatsapp.label}</span>. Orders will list here
          automatically once card / mobile-money payments are switched on.
        </p>
      </div>

      <div className="mt-6">
        <Panel title="How it works today">
          <ol className="space-y-3 text-sm text-fog">
            <li><span className="text-acid">01</span> — Customer builds a bag and hits checkout.</li>
            <li><span className="text-acid">02</span> — They enter shipping details; shipping is auto-calculated by zone.</li>
            <li><span className="text-acid">03</span> — &ldquo;Complete via WhatsApp&rdquo; opens a chat with the full order summary + reference.</li>
            <li><span className="text-acid">04</span> — You confirm stock and send payment instructions in-chat.</li>
          </ol>
        </Panel>
      </div>
    </div>
  );
}
