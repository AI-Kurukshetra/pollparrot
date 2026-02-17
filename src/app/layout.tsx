import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PollParrot - Create Surveys That Get Results",
    template: "%s | PollParrot",
  },
  description:
    "Build beautiful surveys, collect responses, and analyze results with PollParrot. The easiest way to create professional surveys and forms.",
  keywords: [
    "survey builder",
    "form builder",
    "questionnaire",
    "feedback",
    "polls",
    "data collection",
  ],
  authors: [{ name: "PollParrot" }],
  creator: "PollParrot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://pollparrot.com",
    siteName: "PollParrot",
    title: "PollParrot - Create Surveys That Get Results",
    description:
      "Build beautiful surveys, collect responses, and analyze results with PollParrot.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PollParrot - Survey Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PollParrot - Create Surveys That Get Results",
    description:
      "Build beautiful surveys, collect responses, and analyze results with PollParrot.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full w-full bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
