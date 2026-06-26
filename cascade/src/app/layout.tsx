import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ripplecast",
  description: "Explore the ripple effects of any what-if.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;700;800&family=Playfair+Display:wght@400;700&family=Playfair+Display:ital@1&family=Geist:wght@300;400;600&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
