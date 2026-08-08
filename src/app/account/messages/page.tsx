import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session-cookies";
import { getOrCreateForCustomer, markRead } from "@/lib/messages/store";
import { PageHero } from "@/components/layout/page-hero";
import { ChatThread } from "@/components/chat/chat-thread";

export const metadata: Metadata = { title: "Support" };
export const dynamic = "force-dynamic";

export default async function CustomerMessages() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/messages");

  const convo = await getOrCreateForCustomer({ id: user.id, name: user.name, email: user.email });
  await markRead(convo.id, "customer");

  return (
    <div className="pb-24">
      <PageHero code="[ SUPPORT / CHAT ]" title="Talk to the lab" tagline="Questions on an order, sizing, a drop? Message us — we reply here." />

      <div className="container-edge">
        <Link href="/account" className="mb-4 inline-flex items-center gap-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to account
        </Link>
        <div className="h-[60vh] overflow-hidden rounded-2xl border border-smoke bg-ink-soft">
          <ChatThread mode="customer" messages={convo.messages} emptyHint="Start the conversation — ask us anything." />
        </div>
      </div>
    </div>
  );
}
