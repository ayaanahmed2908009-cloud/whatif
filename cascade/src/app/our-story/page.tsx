"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function OurStoryPage() {
  const wiggleRefs = useRef<HTMLDivElement[]>([]);

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

  return (
    <div className="bg-background text-primary selection:bg-secondary-container selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-gutter py-8 w-full">
          <Link className="font-headline-lg text-headline-lg tracking-tighter text-primary" href="/">
            Ripplecast
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-300"
              href="/"
            >
              Go Back to Landing Page
            </Link>
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 hover:bg-secondary duration-300"
            >
              Get Started
            </Link>
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
            className="abstract-wiggle top-[10%] left-[6%] animate-float"
            style={{ animationDelay: "0s" }}
          >
            <svg fill="none" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 100C20 60 60 20 100 20C140 20 180 60 180 100C180 140 140 180 100 180C60 180 20 140 20 100Z"
                stroke="#4FD1C5"
                strokeDasharray="10 10"
                strokeWidth="2"
              />
              <path d="M50 100C50 120 80 80 100 100C120 120 150 80 150 100" stroke="#4FD1C5" strokeLinecap="round" strokeWidth="8" />
            </svg>
          </div>
          <div
            ref={(el) => {
              if (el) wiggleRefs.current[1] = el;
            }}
            className="abstract-wiggle top-[35%] right-[6%] animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <svg fill="none" height="180" viewBox="0 0 180 180" width="180" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="90" r="70" stroke="#F687B3" strokeWidth="1" />
              <path d="M40 90C40 70 70 110 90 90C110 70 140 110 140 90" stroke="#F687B3" strokeLinecap="round" strokeWidth="12" />
            </svg>
          </div>
          <div
            ref={(el) => {
              if (el) wiggleRefs.current[2] = el;
            }}
            className="abstract-wiggle bottom-[15%] left-[12%] animate-float"
            style={{ animationDelay: "3s" }}
          >
            <svg fill="none" height="120" viewBox="0 0 240 120" width="240" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 60C30 20 60 100 90 60C120 20 150 100 180 60C210 20 230 60 230 60"
                stroke="#ECC94B"
                strokeLinecap="round"
                strokeWidth="6"
              />
            </svg>
          </div>
        </div>

        <section className="relative z-10 max-w-container-max mx-auto px-gutter flex flex-col items-center text-center">
          <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-6">Our Story</span>
          <div className="max-w-[800px] space-y-8">
            <h1 className="font-display-xl text-display-xl tracking-tight text-primary">
              Hi, I&apos;m Ayaan Ahmed. I built Ripplecast because{" "}
              <span className="text-secondary">I got bored</span> one night and didn&apos;t stop.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
              I&apos;m a rising senior in high school. This isn&apos;t a startup or a class project—it&apos;s just the
              thing I ended up building after asking myself one too many &quot;what if&quot; questions.
            </p>
          </div>
        </section>

        <section className="relative z-10 mt-section-padding-lg pb-section-padding-sm">
          <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                Why This Project
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
                I was procrastinating on actual homework and ended up here instead.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                It started with a dumb question I asked in a history class—&quot;what if the Library of Alexandria
                never burned?&quot;—and the answer I found online wasn&apos;t good enough. So I figured I&apos;d just
                build something that could actually answer it.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No team, no funding, no real plan. Just a laptop, a lot of late nights, and the kind of stubbornness
                that comes from genuinely wanting to know the answer.
              </p>
            </div>
            <div className="relative">
              <div className="glass-card rounded-2xl mockup-shadow p-10 transform rotate-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                    The Spark
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-primary">
                  &quot;What if the Library of Alexandria never burned?&quot; — a question that&apos;s been stuck in
                  my head since 10th grade history class.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 bg-surface-container-low py-section-padding-lg">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-16 max-w-[700px] mx-auto">
              <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                How It&apos;s Built
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-4 mb-4">
                I built every piece of this myself, between homework and sleep.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                It&apos;s a side project, but I didn&apos;t let myself cut corners on it. I wanted it to actually hold
                up—not just look like a finished thing in a screenshot.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">
                  A Branching Engine, From Scratch
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  I wrote the logic that traces how one change ripples outward—politically, socially, economically—
                  myself. No templates, just a lot of trial and error.
                </p>
              </div>
              <div className="glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors">
                <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">data_object</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">Actual Historical Data</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Every scenario is grounded in real historical and statistical sources—not just whatever sounded
                  plausible at 1am.
                </p>
              </div>
              <div className="glass-card p-10 rounded-2xl hover:border-secondary/40 transition-colors">
                <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center mb-6 text-white">
                  <span className="material-symbols-outlined">design_services</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">A Real Design System</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  I built out an actual design system before writing a single component, because I wanted this to
                  look like more than a school project.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-section-padding-lg">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-20 max-w-[700px] mx-auto">
              <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                The Build
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-4">
                From a random question to an actual working thing.
              </h2>
            </div>
            <div className="relative max-w-[700px] mx-auto">
              <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-1/2" />
              <div className="space-y-12">
                <div className="relative flex items-start md:items-center md:justify-start gap-6 pl-12 md:pl-0">
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white z-10">
                    <span className="material-symbols-outlined text-lg">bedtime</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 md:w-[45%] md:mr-auto">
                    <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                      Month 0
                    </span>
                    <h4 className="font-headline-lg text-headline-lg-mobile text-primary text-xl mt-2 mb-2">
                      A question I couldn&apos;t drop
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Asked it in class, got an unsatisfying answer, decided to figure it out myself instead.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start md:items-center md:justify-end gap-6 pl-12 md:pl-0">
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white z-10">
                    <span className="material-symbols-outlined text-lg">account_tree</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 md:w-[45%] md:ml-auto">
                    <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                      Month 1–2
                    </span>
                    <h4 className="font-headline-lg text-headline-lg-mobile text-primary text-xl mt-2 mb-2">
                      First version of the branching logic
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Got a rough prototype working that could actually trace a divergence forward.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start md:items-center md:justify-start gap-6 pl-12 md:pl-0">
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-white z-10">
                    <span className="material-symbols-outlined text-lg">query_stats</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 md:w-[45%] md:mr-auto">
                    <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                      Month 3–4
                    </span>
                    <h4 className="font-headline-lg text-headline-lg-mobile text-primary text-xl mt-2 mb-2">
                      Swapping guesses for actual data
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Started pulling in real sources instead of just making educated guesses.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start md:items-center md:justify-end gap-6 pl-12 md:pl-0">
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white z-10">
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 md:w-[45%] md:ml-auto">
                    <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">
                      Today
                    </span>
                    <h4 className="font-headline-lg text-headline-lg-mobile text-primary text-xl mt-2 mb-2">
                      Ripplecast, actually live
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Still just me working on it in my free time. Still trying to make it better.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 pb-section-padding-lg">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="bg-primary p-10 md:p-16 rounded-2xl text-white flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative z-10 max-w-[600px]">
                <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4">
                  Started out of boredom. Didn&apos;t stay that way.
                </h3>
                <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-8">
                  That&apos;s pretty much the whole story. No team, no investors—just a high schooler who got curious
                  and kept going.
                </p>
                <Link
                  href="/"
                  className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-secondary-fixed transition-all inline-block"
                >
                  Go Try It Yourself
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hub
                </span>
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
