import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArgusChat from "@/components/argus/ArgusChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mitryxa | AI Decision Platforms",
  description: "Mitryxa builds AI decision platforms and digital intelligence systems that educate customers, discover opportunities, and generate highly qualified leads for professional service businesses.",
  metadataBase: new URL("https://mitryxa.com"),
  openGraph: {
    title: "Mitryxa | AI Decision Platforms",
    description: "Websites that think before your sales team has to.",
    url: "https://mitryxa.com",
    siteName: "Mitryxa",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ArgusChat floatingBubble />
      </body>
    </html>
  );
}
