import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
    <html lang="en" className={playfair.variable}>
      <body className="antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
