import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mitryxa — AI Decision Platforms & Digital Intelligence",
  description: "Mitryxa builds AI-powered decision platforms and digital intelligence systems for growth-focused businesses.",
  keywords: ["AI agency", "digital intelligence", "web design", "AI platforms", "Los Angeles"],
  openGraph: {
    title: "Mitryxa — AI Decision Platforms",
    description: "AI-powered decision platforms for growth-focused businesses.",
    url: "https://mitryxa.com",
    siteName: "Mitryxa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ScrollToTop />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
