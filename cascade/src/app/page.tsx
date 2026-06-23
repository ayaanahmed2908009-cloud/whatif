import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="max-w-[800px] font-sans text-[48px] font-bold leading-[56px] tracking-[-0.02em] text-on-surface">
        Divergence
      </h1>
      <p className="max-w-[600px] text-[20px] leading-[32px] text-on-surface-variant">
        A counterfactual engine. Ask any what-if, explore the cascade.
      </p>
      <Link
        href="/cascade"
        className="rounded-lg bg-primary px-8 py-4 font-semibold text-on-primary transition-colors hover:bg-secondary"
      >
        Try Cascade
      </Link>
    </main>
  );
}
