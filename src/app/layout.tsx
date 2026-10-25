import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/pixel-retroui-setup.js";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURALIS — Retro Music Operating System",
  description:
    "A modern retro music discovery and streaming platform engineered for pristine high-fidelity audio, tactile retro UI, and immersive playback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="h-full bg-[#090909] text-white antialiased overflow-hidden font-sans">
        <div className="crt-overlay" aria-hidden="true" />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
