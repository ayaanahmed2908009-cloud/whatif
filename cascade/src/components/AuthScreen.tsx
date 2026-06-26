"use client";

import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type Mode = "signup" | "signin";

function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/popup-closed-by-user":
      return "";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthScreen({ onContinue }: { onContinue: () => void }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onContinue();
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String((err as { code: string }).code) : "";
      console.error("Auth error:", err);
      setError(friendlyAuthError(code));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onContinue();
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String((err as { code: string }).code) : "";
      console.error("Google sign-in error:", err);
      const message = friendlyAuthError(code);
      if (message) setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-[#101419] text-[#e0e2eb] font-[Geist,sans-serif] selection:bg-[#00e5ff]/20">
      <div className="fixed inset-0 z-0">
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdG6pdAxvBUEk1mGsfhG51E6p1xfaaLYrgJsrMbqfbnxejRDRtvKbQDPAEozc1TS8OroydIifma5FfT17N2d8EmW606sbdpwOZOEiZwq8-Z3ACelclRi1HqWRHwvSOYvRO6jZddBxAwR-UKmHIUHsQv8LKCTyRA0paoYFJYbD_bWC0FKBzZwNYcjhDbheg5jZm5mUI_OXHsGS4Lt6W6PDW9awf833gg6PDD7G67T5o3wYSz08bxUq0EZxrDGDFXiEes1k5MeZlYxU')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101419]/40 to-[#101419]/95" />
      </div>

      <main className="relative z-10 flex flex-col min-h-screen px-5 pt-12 pb-8 items-center max-w-[800px] mx-auto">
        <header className="w-full flex justify-center mb-24">
          <h1 className="font-['Playfair_Display',serif] text-[40px] leading-[1.2] tracking-tighter text-[#e0e2eb]">
            Ripplecast
          </h1>
        </header>

        <div className="w-full rounded-xl p-8 flex flex-col items-center space-y-8 bg-[rgba(10,25,47,0.7)] backdrop-blur-xl border border-white/10">
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 border border-[#00e5ff]/30 rounded-sm mb-2">
              <span className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#00e5ff]">
                SIMULATION READY
              </span>
            </div>
            <h2 className="font-['Playfair_Display',serif] text-[32px] leading-[1.3] text-[#e0e2eb]">
              Almost there......
            </h2>
            <p className="text-[18px] leading-[1.6] tracking-[0.01em] font-light text-[#bac9cc] opacity-80">
              Your alternative reality is waiting for you....
            </p>
          </div>

          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc] mb-2 ml-1">
                  EMAIL
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#bac9cc]/50 text-[20px]">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-[#1c2026]/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/20 transition-all text-[16px] text-[#e0e2eb] placeholder:text-[#bac9cc]/30"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc] mb-2 ml-1">
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#bac9cc]/50 text-[20px]">
                    lock_open
                  </span>
                  <input
                    className="w-full bg-[#1c2026]/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/20 transition-all text-[16px] text-[#e0e2eb] placeholder:text-[#bac9cc]/30"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-[#ff8a80] text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="cascade-button w-full bg-[#e0e2eb] text-[#101419] font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium py-5 rounded-full flex items-center justify-center space-x-2 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <span>{mode === "signup" ? "CREATE ACCOUNT" : "LOG IN"}</span>
              <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_right</span>
            </button>
          </form>

          <div className="w-full flex items-center space-x-4">
            <div className="h-[1px] flex-grow bg-white/10" />
            <span className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc]/40">
              OR
            </span>
            <div className="h-[1px] flex-grow bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium py-4 rounded-lg flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>{mode === "signup" ? "SIGN UP WITH GOOGLE" : "LOG IN WITH GOOGLE"}</span>
          </button>
        </div>

        <footer className="mt-12 flex flex-col items-center space-y-6">
          <p className="text-[16px] text-[#bac9cc]">
            {mode === "signup" ? "Already have an account?" : "New here?"}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === "signup" ? "signin" : "signup");
              }}
              className="text-[#00e5ff] font-semibold hover:underline underline-offset-4 ml-1"
            >
              {mode === "signup" ? "Log in" : "Create an account"}
            </button>
          </p>
          <div className="flex space-x-6">
            <a className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc]/60 hover:text-[#e0e2eb] transition-colors" href="#" onClick={(e) => e.preventDefault()}>
              PRIVACY
            </a>
            <a className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc]/60 hover:text-[#e0e2eb] transition-colors" href="#" onClick={(e) => e.preventDefault()}>
              TERMS
            </a>
            <a className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.15em] font-medium text-[#bac9cc]/60 hover:text-[#e0e2eb] transition-colors" href="#" onClick={(e) => e.preventDefault()}>
              RIPPLECAST · BETA
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
