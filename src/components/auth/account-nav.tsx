"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

type Me = { name: string; role: "admin" | "customer" } | null;

/** Header account control — signed out → Sign In, signed in → account/lab link. */
export function AccountNav() {
  const [me, setMe] = useState<Me>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (alive) {
          setMe(d.user);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const href = me ? (me.role === "admin" ? "/admin" : "/account") : "/login";
  const label = !loaded ? "" : me ? (me.role === "admin" ? "Lab" : "Account") : "Sign In";

  return (
    <Link
      href={href}
      aria-label={me ? "Your account" : "Sign in"}
      className="hidden items-center gap-1.5 text-mono text-[0.7rem] uppercase tracking-[0.25em] text-bone transition-colors hover:text-acid md:inline-flex"
    >
      <User className="h-4 w-4" />
      {label}
    </Link>
  );
}
