import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Ripplecast",
};

export default function PrivacyPolicyPage() {
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
          </div>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary text-3xl">menu</span>
          </div>
        </nav>
      </header>

      <main className="relative pt-40 pb-section-padding-sm">
        <div className="max-w-[760px] mx-auto px-gutter">
          <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-6 block">
            Legal
          </span>
          <h1 className="text-[56px] leading-[64px] tracking-[-0.03em] font-extrabold text-primary mb-6">
            Privacy Policy
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-12">
            Last updated: sometime in 2026. We may update this from time to time, in our sole discretion, without
            necessarily telling you when.
          </p>

          <div className="space-y-10 font-body-md text-body-md text-on-surface-variant">
            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">
                1. Our Commitment to Privacy
              </h2>
              <p>
                At Ripplecast (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; &quot;the Engine,&quot; or, in
                certain contexts, &quot;the Service&quot;), we take your privacy extremely seriously, in the sense
                that we have thought about it at least once. This Privacy Policy is intended to generally describe,
                in broad and occasionally circular terms, the kinds of things that may, under some circumstances,
                happen to certain categories of information you may or may not provide to us.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">
                2. Information We May Collect
              </h2>
              <p>
                Depending on how you use the Service, and subject to ordinary technical limitations, we may collect
                information that could include, without being limited to, things such as: account information you
                provide; the &quot;what if&quot; premises you submit, which we consider both data and, frankly,
                kind of fun to read; usage patterns, in the aggregate or otherwise; and other information generated
                incidentally by your use of the Engine, the precise nature of which we reserve the right to
                characterize as we see fit at a later date.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">
                3. How We May Use Information
              </h2>
              <p>
                Information collected may be used for purposes including, but not limited to: operating,
                maintaining, and improving the Service; understanding, in a general sense, how people use the
                Service; communicating with you about the Service, as applicable; complying with legal obligations,
                where such obligations exist; and other business purposes consistent with the spirit, if not always
                the letter, of this Policy.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">4. Third Parties</h2>
              <p>
                We may share information with certain third-party service providers who help us operate the
                Service, such as cloud infrastructure providers, authentication providers, and model providers, to
                the extent reasonably necessary, in our judgment, for the purposes described above. We do not sell
                your personal information, as that term is commonly understood, though we note that &quot;common
                understanding&quot; of such terms can vary by jurisdiction and is, in any event, subject to change.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">5. Data Retention</h2>
              <p>
                We retain information for as long as we determine, in our discretion, that it remains useful,
                relevant, or simply easier to keep than to delete, subject to applicable law and our own evolving
                sense of what counts as &quot;necessary.&quot;
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">6. Security</h2>
              <p>
                We maintain reasonable safeguards designed to protect information, in keeping with general industry
                practices as we understand them at any given time. No method of transmission or storage is
                completely secure, and by using the Service you acknowledge this is, in fact, true of basically
                everything on the internet.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">7. Your Choices</h2>
              <p>
                You may have certain rights regarding your information depending on where you live, which we will
                honor to the extent required by applicable law and to the extent we are able to determine, with
                reasonable confidence, what those rights actually are.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">
                8. Changes to This Policy
              </h2>
              <p>
                We may revise this Policy periodically, occasionally, or whenever it seems like a good idea.
                Continued use of the Service after any such revision constitutes your acceptance of the revised
                Policy, whether or not you noticed it changed.
              </p>
            </section>

            <section>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">9. Contact</h2>
              <p>
                If you have questions about this Policy, you are welcome to reach out through the contact details
                listed elsewhere on this site, and we will respond within a timeframe we consider reasonable.
              </p>
            </section>
          </div>
        </div>
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
