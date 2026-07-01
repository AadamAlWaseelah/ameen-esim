import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

// Display / headings. Geometric grotesk — modern, techy, pairs with the
// humanist Hanken body on a contrast axis (geometric ↔ humanist).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body / UI. Tabular figures available via the .tnum utility for prices.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ameenesim.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ameen eSIM · Saudi data eSIMs for Umrah & Hajj",
    template: "%s · Ameen eSIM",
  },
  description:
    "Stay connected in Saudi Arabia for your Umrah or Hajj. Instant data eSIMs, delivered by email. A trading name of Al-Waseelah Tours Ltd.",
  openGraph: {
    title: "Ameen eSIM · Saudi data eSIMs for Umrah & Hajj",
    description:
      "Instant Saudi data eSIMs for pilgrims. Honest data, delivered by email.",
    siteName: "Ameen eSIM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {/* Arm scroll-reveal before paint so enhanced entrances don't flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <div className="flex min-h-dvh flex-col">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
