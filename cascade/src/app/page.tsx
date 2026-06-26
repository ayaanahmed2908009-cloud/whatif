"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserCascades, SavedCascade } from "@/lib/cascades";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [cascades, setCascades] = useState<SavedCascade[]>([]);
  const [loadingCascades, setLoadingCascades] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    if (!user) {
      setCascades([]);
      return;
    }
    setLoadingCascades(true);
    getUserCascades(user.uid)
      .then(setCascades)
      .catch((err) => console.error("Failed to load cascades:", err))
      .finally(() => setLoadingCascades(false));
  }, [user]);

  if (user === undefined) {
    return <main className="min-h-screen" />;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[800px] flex-col gap-8 px-6 py-16">
      <h1 className="font-sans text-[36px] font-bold tracking-[-0.02em] text-on-surface">
        Your cascades
      </h1>

      {loadingCascades ? (
        <p className="text-[16px] text-on-surface-variant">Loading your cascades...</p>
      ) : cascades.length === 0 ? (
        <p className="text-[16px] text-on-surface-variant">
          You haven&apos;t explored any cascades yet. Head back to the landing page and ask a
          &ldquo;what if&rdquo; to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {cascades.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-lg border-[0.5px] border-outline-variant bg-surface-container-lowest px-6 py-5"
            >
              <p className="text-[18px] leading-[26px] text-on-surface">{c.tree.premise}</p>
              <Link
                href={`/cascade?load=${c.id}`}
                className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-on-primary transition-colors hover:bg-secondary"
              >
                Enter World
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
