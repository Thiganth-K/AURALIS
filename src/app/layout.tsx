import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import "@/lib/pixel-retroui-setup.js";
import { AppShell } from "@/components/layout/AppShell";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURALIS — Editorial Retro Music Platform",
  description:
    "A premium editorial retro music catalog engineered for pristine high-fidelity audio, analog Hi-Fi hardware aesthetics, and tactile playback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${ibmPlexMono.variable} ${inter.variable} h-full`}
    >
      <body className="h-full bg-[#F5F1E8] text-[#111111] antialiased overflow-hidden font-sans selection:bg-[#F05A28] selection:text-[#111111]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
