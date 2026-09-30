import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Instrument_Serif, DM_Sans } from "next/font/google";

// const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
// const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mercora.com"),
  title: {
    default: "Mercora | Storefronts, Payments, Receipts & Settlements",
    template: "%s | Mercora",
  },
  description:
    "Mercora helps African merchants launch storefronts, manage orders, accept payments, issue receipts, and track settlements with confidence.",
  applicationName: "Mercora",
  keywords: [
    "Mercora",
    "African commerce SaaS",
    "storefront",
    "payments",
    "receipts",
    "settlements",
    "merchant platform",
    "ecommerce",
  ],
  authors: [{ name: "Mercora" }],
  creator: "Mercora",
  publisher: "Mercora",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Mercora | Build. Sell. Get Paid.",
    description:
      "Storefronts, payments, receipts, and settlement visibility built for African merchants.",
    url: "https://www.mercora.com",
    siteName: "Mercora",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercora | Build. Sell. Get Paid.",
    description:
      "Storefronts, payments, receipts, and settlement visibility built for African merchants.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040A18",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-1 font-sans text-white antialiased">
        <a
          href="#main-content"
          className="sr-only z-[999] rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-neutral-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-3xl" />
            <div className="absolute right-0 top-[120px] h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-[18%] h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_28%)]" />
            <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(to_bottom,rgba(91,61,245,0.08),transparent)]" />
          </div>

          <Header />

          <main id="main-content" className="relative z-10 flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}