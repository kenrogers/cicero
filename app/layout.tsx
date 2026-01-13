import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
