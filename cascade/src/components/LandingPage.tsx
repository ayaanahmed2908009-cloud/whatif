"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CAROUSEL_SLIDES = [
  {
    image: "/images/hero-caesar-london.png",
    alt: "Caesar holding a modern press conference in front of Parliament in London, surrounded by reporters with phones and microphones",
    prompt: "Rome never fell, and Caesar held a press conference in modern London?",
  },
  {
    image: "/images/duel-mode-soviet-invasion.png",
    alt: "A Soviet armored column with tanks and soldiers occupying a small American town, with a Soviet flag raised next to an American flag",
    prompt: "The Cold War turned hot, and Soviet forces occupied small-town America?",
  },
  {
    image: "/images/king-trump-coronation.png",
    alt: "Donald Trump crowned as a king delivering an address at the US Capitol, surrounded by both supportive and protesting crowds",
    prompt: "America became a monarchy, and the President was crowned king?",
  },
  {
    image: "/images/mongol-eurasian-khaganate.png",
    alt: "A Mongol khan standing in a futuristic high-tech city, the capital of a surviving Eurasian Khaganate",
    prompt: "The Mongol Empire never collapsed, and ruled a unified Eurasia into the present day?",
  },
  {
    image: "/images/unified-korea.png",
    alt: "A monument and ceremony celebrating the reunification of North and South Korea in a modern city square",
    prompt: "North and South Korea peacefully reunified into a single nation?",
  },
];

const TRENDING_CHIPS = [
  { label: "Cold War Mars Landing", prompt: "the Cold War had ended with a Mars landing instead of a moon landing?" },
  { label: "Silicon Valley in 1890", prompt: "Silicon Valley had existed in 1890?" },
];

const ERROR_MESSAGES: Record<string, string> = {
  WHATIF_001: 'Type a "what if" to get started.',
  WHATIF_002: "That doesn't read as a \"what if\" scenario. Try framing it as a clear hypothetical.",
  WHATIF_003:
    "That premise isn't something we can explore here. Try a different historical, scientific, or speculative \"what if.\"",
  WHATIF_004: 'Ripplecast is built for historical, scientific, and speculative "what if" scenarios — try one of those.',
  WHATIF_005: "That's a bit too out-there for us to build a coherent cascade from. Try grounding it in a real premise.",
  WHATIF_006: "Something went wrong generating that cascade. Please try again.",
  WHATIF_007: "Something went wrong generating that cascade. Please try again.",
  WHATIF_008:
    "Ripplecast focuses on historical, scientific, and technological \"what if\" scenarios. Personal or identity-based premises aren't supported — try a historical or scientific one instead.",
  WHATIF_500: "The engine isn't configured correctly. Please try again later.",
};

// "What if" is a fixed, bold prefix in the UI — the user only ever types the
// continuation. Guard against a pasted continuation that redundantly starts
// with "what if" itself.
function buildPremise(continuation: string): string {
  const trimmed = continuation.trim();
  const withoutPrefix = trimmed.replace(/^what if\s+/i, "");
  return `What if ${withoutPrefix}`.trim();
}

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const wiggleRefs = useRef<HTMLDivElement[]>([]);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [heroValue, setHeroValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  // Background wiggle parallax.
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      wiggleRefs.current.forEach((wiggle, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        wiggle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Surface safeguarding errors from the cascade engine (off-topic, unsafe,
  // too bizarre, etc.) back where the premise was typed.
  useEffect(() => {
    const code = searchParams.get("error");
    if (!code) return;

    setErrorMessage(ERROR_MESSAGES[code] || "Something went wrong. Please try again.");
    router.replace("/");
    heroInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    heroInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function goToCascade(continuation: string) {
    if (!continuation.trim()) return;
    const params = new URLSearchParams({ premise: buildPremise(continuation), autostart: "1" });
    router.push(`/cascade?${params.toString()}`);
  }

  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToCascade(heroValue || heroInputRef.current?.placeholder || "");
  }

  function activateCaption(prompt: string) {
    setHeroValue(prompt);
    heroInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    heroInputRef.current?.focus();
  }

  function focusHero() {
    heroInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    heroInputRef.current?.focus();
  }

  const slideCount = CAROUSEL_SLIDES.length;
  function goToSlide(index: number) {
    setCurrent(((index % slideCount) + slideCount) % slideCount);
  }

  return (
    <div className="bg-background text-primary selection:bg-secondary-container selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-gutter py-8 w-full">
          <div className="font-headline-lg text-headline-lg tracking-tighter text-primary">Ripplecast</div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-300"
              href="/our-story"
            >
              Our Story
            </Link>
            <button
              type="button"
              onClick={focusHero}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 hover:bg-secondary duration-300"
            >
              Get Started
            </button>
          </div>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary text-3xl">menu</span>
          </div>
        </nav>
      </header>

      <main className="relative pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none hero-gradient">
          <div
            ref={(el) => {
              if (el) wiggleRefs.current[0] = el;
            }}
            className="abstract-wiggle top-[15%] left-[5%] animate-float"
            style={{ animationDelay: "0s" }}
          >
            <svg fill="none" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="20" stroke="#4FD1C5" strokeWidth="2" opacity="0.9" />
              <circle cx="100" cy="100" r="55" stroke="#4FD1C5" strokeWidth="2" opacity="0.5" />
              <circle cx="100" cy="100" r="90" stroke="#4FD1C5" strokeWidth="2" opacity="0.25" />
            </svg>
          </div>
          <div
            ref={(el) => {
              if (el) wiggleRefs.current[1] = el;
            }}
            className="abstract-wiggle top-[40%] right-[8%] animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <svg fill="none" height="180" viewBox="0 0 180 180" width="180" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="90" r="18" stroke="#F687B3" strokeWidth="2" opacity="0.9" />
              <circle cx="90" cy="90" r="48" stroke="#F687B3" strokeWidth="2" opacity="0.5" />
              <circle cx="90" cy="90" r="78" stroke="#F687B3" strokeWidth="2" opacity="0.25" />
            </svg>
          </div>
          <div
            ref={(el) => {
              if (el) wiggleRefs.current[2] = el;
            }}
            className="abstract-wiggle bottom-[20%] left-[10%] animate-float"
            style={{ animationDelay: "3s" }}
          >
            <svg fill="none" height="160" viewBox="0 0 160 160" width="160" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="14" stroke="#ECC94B" strokeWidth="2" opacity="0.9" />
              <circle cx="80" cy="80" r="40" stroke="#ECC94B" strokeWidth="2" opacity="0.5" />
              <circle cx="80" cy="80" r="66" stroke="#ECC94B" strokeWidth="2" opacity="0.25" />
            </svg>
          </div>
        </div>

        <section className="relative z-10 max-w-container-max mx-auto px-gutter flex flex-col items-center text-center">
          <div className="max-w-[800px] space-y-8">
            <h1 className="font-display-xl text-display-xl tracking-tight text-primary">
              Explore the ripple effects of What If.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
              Pick a historical, scientific, or technological &quot;what if&quot; and watch the consequences ripple
              outward, branch by branch.
            </p>
          </div>

          <div className="mt-16 w-full max-w-[700px] relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary-container to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <form
              onSubmit={handleHeroSubmit}
              className="relative flex items-center glass-card rounded-2xl px-6 py-5 mockup-shadow"
            >
              <span className="material-symbols-outlined text-secondary mr-4 text-2xl">auto_fix_high</span>
              <span className="font-body-lg text-body-lg font-bold text-primary whitespace-nowrap mr-2 select-none">
                What if
              </span>
              <input
                ref={heroInputRef}
                value={heroValue}
                onChange={(e) => setHeroValue(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full font-body-lg text-primary placeholder:text-on-surface-variant/50"
                placeholder="the Library of Alexandria never burned?"
                type="text"
              />
              <button
                type="submit"
                className="bg-primary text-white p-3 rounded-xl ml-4 hover:bg-secondary transition-colors duration-300 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
            {errorMessage && (
              <p className="mt-3 text-center text-body-md font-body-md text-[#ba1a1a]">{errorMessage}</p>
            )}
            <div className="mt-4 flex justify-center gap-4">
              <span className="text-label-caps font-label-caps text-on-surface-variant/60 uppercase tracking-widest">
                Trending Speculations:
              </span>
              {TRENDING_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  onClick={() => goToCascade(chip.prompt)}
                  className="text-label-caps font-label-caps text-secondary cursor-pointer hover:underline"
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-section-padding-lg relative z-10 pb-section-padding-lg">
          <div className="max-w-container-max mx-auto px-gutter relative">
            <div className="relative mx-auto max-w-[1000px] glass-card rounded-2xl mockup-shadow overflow-hidden transform -rotate-1">
              <div className="h-8 bg-surface-container flex items-center px-4 border-b border-outline-variant/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/40" />
                  <div className="w-3 h-3 rounded-full bg-secondary/40" />
                  <div className="w-3 h-3 rounded-full bg-secondary-container/40" />
                </div>
                <div className="mx-auto text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
                  {`Scenario ${String(current + 1).padStart(2, "0")} / ${String(slideCount).padStart(2, "0")}`}
                </div>
              </div>

              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <div
                  className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {CAROUSEL_SLIDES.map((slide) => (
                    <div key={slide.prompt} className="w-full h-full flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={slide.alt} className="w-full h-full object-cover" src={slide.image} />
                      <div
                        onClick={() => activateCaption(slide.prompt)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            activateCaption(slide.prompt);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent cursor-pointer"
                      >
                        <span className="text-label-caps font-label-caps text-secondary-container uppercase tracking-widest">
                          What if
                        </span>
                        <h3 className="font-headline-lg text-headline-lg-mobile text-white mt-2 max-w-[500px]">
                          {slide.prompt}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToSlide(current - 1)}
                aria-label="Previous scenario"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => goToSlide(current + 1)}
                aria-label="Next scenario"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>

              <div className="absolute bottom-4 right-6 z-10 flex gap-2">
                {CAROUSEL_SLIDES.map((slide, i) => (
                  <button
                    key={slide.prompt}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to scenario ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-section-padding-lg">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">How it actually works</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No flat one-paragraph answer — a tree of consequences you can actually explore.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors group">
                <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">account_tree</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">Three Levels of Ripples</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[500px]">
                  Every premise branches into direct consequences, then second-order effects, each one viewed through
                  a different lens — social, economic, technological, or human.
                </p>
              </div>
              <div className="glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors">
                <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">query_stats</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">Probability, Labeled Honestly</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Each branch is tagged from near-certain knock-on effects down to speculative leaps, so you can tell
                  the difference at a glance.
                </p>
              </div>
              <div className="glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">Save and Revisit</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Sign in and every cascade you generate is saved to your own library — come back and pick up where
                  you left off.
                </p>
              </div>
              <div className="md:col-span-2 bg-primary p-10 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-headline-lg text-headline-lg-mobile mb-4">Ready to branch out?</h3>
                  <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-8 max-w-[400px]">
                    Pick a premise, see where it leads.
                  </p>
                  <button
                    type="button"
                    onClick={focusHero}
                    className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-secondary-fixed transition-all"
                  >
                    Cast a Ripple
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-gutter py-section-padding-sm w-full">
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-8 md:mb-0">Ripplecast</div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex gap-8">
              <Link
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors duration-200"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <a
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors duration-200"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors duration-200"
                href="#"
              >
                Contact
              </a>
            </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-80">
              © 2026 Ripplecast. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
