import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session-cookies";
import { AuthForm } from "@/components/auth/auth-form";
import { shopConfig } from "@/lib/shop/config";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in? Send them where they belong.
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/account");

  const { next } = await searchParams;

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-6 py-28">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="eyebrow">
            ← {shopConfig.brand.name}
          </Link>
          <h1 className="mt-5 font-display display-lg text-bone">
            The Lab<span className="text-acid">.</span>
          </h1>
          <p className="mt-3 text-fog">Sign in — or create your pass to the drop.</p>
        </div>

        <div className="flex justify-center">
          <AuthForm next={next} />
        </div>

        <p className="mt-8 text-center text-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.15em] text-ash">
          One door for everyone. You&rsquo;ll land in your account —<br />
          the team lands in the lab.
        </p>
      </div>
    </div>
  );
}
