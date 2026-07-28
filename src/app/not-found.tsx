import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-edge flex min-h-[80vh] flex-col items-center justify-center text-center">
      <span className="eyebrow">[ ERROR / 404 — SPECIMEN NOT FOUND ]</span>
      <h1 className="mt-6 font-display display-hero text-bone">
        4<span className="text-acid">0</span>4
      </h1>
      <p className="mt-4 max-w-sm text-fog">
        This experiment doesn&apos;t exist — or it&apos;s already been retired from the lab.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="bg-bone px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-transform hover:scale-[1.02]"
        >
          Back Home
        </Link>
        <Link
          href="/collections"
          className="link-underline px-4 py-4 text-mono text-xs uppercase tracking-[0.25em] text-bone"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  );
}
