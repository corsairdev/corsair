import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { CorsairProvider } from "@corsair-ai/core/client";

export const metadata: Metadata = {
  title: "Corsair",
  description: "Corsair",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <CorsairProvider>{children}</CorsairProvider>
      </body>
    </html>
  );
}
