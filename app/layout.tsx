import type { Metadata } from "next";
import { Cinzel, Source_Sans_3 } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Cicero | Fort Collins City Council Summaries",
    template: "%s | Cicero",
  },
  description:
    "AI-powered summaries of Fort Collins City Council meetings. Stay informed about local government decisions, key topics, and how to get involved.",
  keywords: [
    "Fort Collins",
    "City Council",
    "meeting summaries",
    "civic engagement",
    "local government",
    "Colorado",
  ],
  authors: [{ name: "Cicero" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cicero",
    title: "Cicero | Fort Collins City Council Summaries",
    description:
      "AI-powered summaries of Fort Collins City Council meetings. Stay informed about local government decisions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cicero | Fort Collins City Council Summaries",
    description:
      "AI-powered summaries of Fort Collins City Council meetings. Stay informed about local government decisions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${sourceSans.variable} font-sans antialiased overscroll-none bg-[#FAFAF8] text-[#1a1a1a]`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
