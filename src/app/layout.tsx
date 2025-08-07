import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PlayerProvider } from "@/contexts/PlayerContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional Podcast Player",
  description: "A modern, professional podcast player built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
