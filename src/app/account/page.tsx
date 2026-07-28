import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, ShoppingBag, LogOut, ArrowUpRight, MessageSquare } from "lucide-react";
import { getSession } from "@/lib/auth/session-cookies";
import { findById } from "@/lib/auth/store";
import { logoutAction } from "@/lib/auth/actions";
import { PageHero } from "@/components/layout/page-hero";
import { AddressForm } from "@/components/account/address-form";
import { ProfileForm } from "@/components/account/profile-form";
import { shopConfig } from "@/lib/shop/config";

export const metadata: Metadata = { title: "Your Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const user = await findById(session.sub);
  const firstName = session.name.split(" ")[0];

  return (
    <div className="pb-24">
      <PageHero code="[ ACCOUNT / YOUR LAB PASS ]" title={`Hey, ${firstName}.`} tagline={session.email} />

      <div className="container-edge grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
        {/* Left: quick links + logout */}
        <div className="flex flex-col gap-4">
          <div className="rounded-sm border border-smoke bg-ink-soft p-6">
            <p className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Signed in as</p>
            <p className="mt-2 font-display text-2xl text-bone">{session.name}</p>
            <p className="mt-1 text-sm text-fog">{session.email}</p>
          </div>

          <Link
            href="/account/messages"
            className="flex items-center justify-between border border-smoke bg-ink-soft p-5 transition-colors hover:border-acid"
          >
            <span className="flex items-center gap-3 text-bone">
              <MessageSquare className="h-5 w-5 text-acid" /> Support chat
            </span>
            <ArrowUpRight className="h-4 w-4 text-ash" />
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between border border-smoke bg-ink-soft p-5 transition-colors hover:border-bone"
          >
            <span className="flex items-center gap-3 text-bone">
              <Heart className="h-5 w-5" /> Wishlist
            </span>
            <ArrowUpRight className="h-4 w-4 text-ash" />
          </Link>

          <Link
            href="/collections/new-arrivals"
            className="flex items-center justify-between border border-smoke bg-ink-soft p-5 transition-colors hover:border-bone"
          >
            <span className="flex items-center gap-3 text-bone">
              <ShoppingBag className="h-5 w-5" /> Continue shopping
            </span>
            <ArrowUpRight className="h-4 w-4 text-ash" />
          </Link>

          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 border border-smoke bg-ink-soft p-5 text-ash transition-colors hover:border-acid hover:text-acid">
              <LogOut className="h-5 w-5" /> Sign out
            </button>
          </form>
        </div>

        {/* Right: orders + address */}
        <div className="flex flex-col gap-8">
          <section className="rounded-sm border border-smoke bg-ink-soft p-6">
            <h2 className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Orders</h2>
            <p className="mt-4 text-sm text-fog">
              You complete orders over WhatsApp for now, so they aren&rsquo;t tracked to your account yet. Live order
              history lands with online payments. Questions on a current order?{" "}
              <a
                href={`https://wa.me/${shopConfig.whatsapp.number}`}
                target="_blank"
                rel="noreferrer"
                className="text-acid underline"
              >
                Message us
              </a>
              .
            </p>
          </section>

          <section className="rounded-sm border border-smoke bg-ink-soft p-6">
            <h2 className="mb-5 text-mono text-xs uppercase tracking-[0.25em] text-bone">Your profile</h2>
            <ProfileForm name={session.name} email={session.email} />
          </section>

          <section className="rounded-sm border border-smoke bg-ink-soft p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Shipping address</h2>
              <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                Speeds up checkout
              </span>
            </div>
            <AddressForm address={user?.address} />
          </section>
        </div>
      </div>
    </div>
  );
}
