import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Display-serif för rubriker
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Ren sans-serif för brödtext / UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Code. Solve. Create. | Abdu’s Portfolio",
  description: "A portfolio that tells the story of my growth as a Fullstack Developer who thrives on solving problems!",
  metadataBase: new URL("https://alazzawi.dev/"),
  appleWebApp: { title: 'Al-Azzawi' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
